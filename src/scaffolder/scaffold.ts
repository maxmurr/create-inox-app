import { mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spinner } from "@clack/prompts";
import type { ProjectConfig } from "../types.js";
import { buildTemplateContext } from "./template-context.js";
import { renderTemplateDir } from "./template-renderer.js";
import { writeFiles, mergeFiles, stripPrefix } from "./file-writer.js";
import { gitInit } from "./git-init.js";
import { installDeps } from "./install-deps.js";

const getTemplatesDir = (): string => {
  const thisFile = fileURLToPath(import.meta.url);
  const thisDir = dirname(thisFile);

  // Dev: src/scaffolder/scaffold.ts → src/templates
  const devPath = resolve(thisDir, "..", "templates");
  if (existsSync(devPath)) return devPath;

  // Built: dist/cli.js → dist/templates
  return resolve(thisDir, "templates");
};

export const scaffold = async (config: ProjectConfig): Promise<void> => {
  const s = spinner();
  const templatesDir = getTemplatesDir();
  const context = buildTemplateContext(config);

  // Three output directories: app repo, kustomize/base repo, kustomize/overlays repo
  const appDir = resolve(config.projectDir, config.projectName);
  const kBaseDir = resolve(config.projectDir, "kustomize", "base");
  const kOverlaysDir = resolve(config.projectDir, "kustomize", "overlays");

  s.start("Creating project directories...");
  mkdirSync(appDir, { recursive: true });
  mkdirSync(kBaseDir, { recursive: true });
  mkdirSync(kOverlaysDir, { recursive: true });
  s.stop("Project directories created");

  // --- App files ---
  s.start("Scaffolding app files...");
  const appFiles = new Map<string, string>();

  const baseDir = resolve(templatesDir, "base");
  if (existsSync(baseDir)) {
    mergeFiles(appFiles, renderTemplateDir(baseDir, context));
  }

  const dockerDir = resolve(templatesDir, "docker");
  if (existsSync(dockerDir)) {
    mergeFiles(appFiles, renderTemplateDir(dockerDir, context));
  }

  const ciDir = resolve(templatesDir, "ci");
  if (existsSync(ciDir)) {
    mergeFiles(appFiles, renderTemplateDir(ciDir, context));
  }

  const toolingDir = resolve(templatesDir, "tooling");
  if (existsSync(toolingDir)) {
    const toolingFiles = renderTemplateDir(toolingDir, context);
    const toolingConditions: Record<string, boolean> = {
      "lefthook.yml": context.hasLefthook,
      "commitlint.config.ts": context.hasCommitlint,
      ".oxlintrc.json": context.hasOxlint,
      ".oxfmtrc.json": context.hasOxfmt,
    };
    for (const [file, include] of Object.entries(toolingConditions)) {
      if (!include) toolingFiles.delete(file);
    }
    mergeFiles(appFiles, toolingFiles);
  }

  const presetDir = resolve(templatesDir, "presets", config.template);
  if (existsSync(presetDir)) {
    mergeFiles(appFiles, renderTemplateDir(presetDir, context));
  }

  const claudeAppDir = resolve(templatesDir, "claude-config", "app");
  if (existsSync(claudeAppDir)) {
    const skipSkills: Record<string, boolean> = {
      ".agents/skills/ai-sdk": !context.isAiChatApp,
      ".agents/skills/ai-elements": !context.isAiChatApp,
      ".agents/skills/vercel-react-best-practices": !context.isAiChatApp,
      ".agents/skills/vercel-composition-patterns": !context.isAiChatApp,
      ".agents/skills/web-design-guidelines": !context.isAiChatApp,
      ".agents/skills/frontend-design": !context.isAiChatApp,
      ".agents/skills/streamdown": !context.isAiChatApp,
      ".agents/skills/building-components": !context.isAiChatApp,
      ".agents/skills/postgres-drizzle": !context.hasDatabase,
      ".agents/skills/better-auth-best-practices": !context.hasAuth,
      ".agents/skills/email-and-password-best-practices": !context.hasAuth,
      ".agents/skills/langfuse-observability": !context.hasLangfuse,
      ".agents/skills/workflow": !context.isAiChatApp,
      ".agents/skills/logging-best-practices": !context.isAiChatApp,
      ".agents/skills/next-cache-components": !context.isAiChatApp,
    };
    mergeFiles(appFiles, renderTemplateDir(claudeAppDir, context, skipSkills));
  }

  writeFiles(appDir, appFiles);
  s.stop(`Scaffolded ${appFiles.size} app files → ${config.projectName}/`);

  // --- Kustomize files (split into base + overlays repos) ---
  s.start("Scaffolding kustomize files...");
  const kustomizeTplDir = resolve(templatesDir, "kustomize");
  const claudeKustomizeDir = resolve(templatesDir, "claude-config", "kustomize");
  let kBaseCount = 0;
  let kOverlaysCount = 0;

  if (existsSync(kustomizeTplDir)) {
    const skipDirs: Record<string, boolean> = {
      "base/ingress": !context.hasIngress,
      "base/jobs": !context.hasDatabase,
    };
    const allKustomize = renderTemplateDir(kustomizeTplDir, context, skipDirs);

    // Split into base/ and overlays/
    const baseFiles = stripPrefix("base", allKustomize);
    const overlaysFiles = stripPrefix("overlays", allKustomize);

    // Add claude config to both repos
    if (existsSync(claudeKustomizeDir)) {
      const claudeK8s = renderTemplateDir(claudeKustomizeDir, context);
      mergeFiles(baseFiles, claudeK8s);
      mergeFiles(overlaysFiles, claudeK8s);
    }

    writeFiles(kBaseDir, baseFiles);
    writeFiles(kOverlaysDir, overlaysFiles);
    kBaseCount = baseFiles.size;
    kOverlaysCount = overlaysFiles.size;
  }

  s.stop(
    `Scaffolded ${kBaseCount} base + ${kOverlaysCount} overlays files → kustomize/`,
  );

  // --- Install & git ---
  if (config.install) {
    s.start("Installing dependencies...");
    try {
      await installDeps(appDir);
      s.stop("Dependencies installed");
    } catch {
      s.stop("Failed to install dependencies (run bun install manually)");
    }
  }

  if (config.git) {
    s.start("Initializing git repositories...");
    try {
      await gitInit(appDir);
      await gitInit(kBaseDir);
      await gitInit(kOverlaysDir);
      s.stop("Git repositories initialized (app, kustomize/base, kustomize/overlays)");
    } catch {
      s.stop("Failed to initialize git (run git init manually)");
    }
  }
};
