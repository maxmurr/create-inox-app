import Handlebars from "handlebars";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import type { TemplateContext } from "../types.js";

Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);
Handlebars.registerHelper("neq", (a: unknown, b: unknown) => a !== b);
Handlebars.registerHelper("or", (...args: unknown[]) => {
  const options = args.pop();
  return args.some(Boolean);
});
Handlebars.registerHelper("and", (...args: unknown[]) => {
  const options = args.pop();
  return args.every(Boolean);
});
Handlebars.registerHelper("json", (obj: unknown) =>
  JSON.stringify(obj, null, 2),
);

const walkDir = (dir: string): string[] => {
  const entries: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      entries.push(...walkDir(full));
    } else {
      entries.push(full);
    }
  }
  return entries;
};

export const renderTemplateDir = (
  templateDir: string,
  context: TemplateContext,
  skipDirs?: Record<string, boolean>,
): Map<string, string> => {
  const files = new Map<string, string>();
  const allFiles = walkDir(templateDir);

  for (const absPath of allFiles) {
    let relPath = relative(templateDir, absPath);

    if (skipDirs) {
      const shouldSkip = Object.entries(skipDirs).some(
        ([dir, skip]) => skip && relPath.startsWith(dir),
      );
      if (shouldSkip) continue;
    }

    const content = readFileSync(absPath, "utf-8");

    if (extname(absPath) === ".hbs") {
      relPath = relPath.slice(0, -4);
      const template = Handlebars.compile(content, { noEscape: true });
      const rendered = template(context);

      if (relPath.includes("{{env}}")) {
        for (const env of context.environments) {
          const envPath = relPath.replace(/\{\{env\}\}/g, env.name);
          const envContext = { ...context, currentEnv: env };
          const envTemplate = Handlebars.compile(content, { noEscape: true });
          files.set(envPath, envTemplate(envContext));
        }
      } else {
        files.set(relPath, rendered);
      }
    } else {
      files.set(relPath, content);
    }
  }

  return files;
};

export const renderSingleTemplate = (
  templateStr: string,
  context: TemplateContext,
): string => {
  const template = Handlebars.compile(templateStr, { noEscape: true });
  return template(context);
};
