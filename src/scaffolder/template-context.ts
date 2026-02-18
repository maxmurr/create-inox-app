import type { ProjectConfig, TemplateContext } from "../types.js";
import { buildRegistryImage, buildDomain } from "../constants.js";

export const buildTemplateContext = (config: ProjectConfig): TemplateContext => {
  const environments = config.environments.map((env, i) => ({
    name: env,
    domain: buildDomain(config.projectName, env),
    isFirst: i === 0,
    isLast: i === config.environments.length - 1,
  }));

  return {
    projectName: config.projectName,
    appName: config.projectName,
    gitlabGroup: config.gitlabGroup,
    registryImage: buildRegistryImage(
      config.gitlabGroup,
      config.projectName,
      config.projectName,
    ),

    hasDatabase: config.database !== "none",
    isParadedb: config.database === "postgresql-paradedb",
    hasRedis: config.cache === "redis",
    hasAuth: config.auth === "better-auth",
    hasLangfuse: config.observability === "langfuse",

    hasIngress: config.addons.includes("ingress"),
    hasTls: config.addons.includes("tls"),
    hasPvc: config.addons.includes("pvc"),

    hasTurborepo: config.addons.includes("turborepo"),
    hasOxlint: config.addons.includes("oxlint"),
    hasOxfmt: config.addons.includes("oxfmt"),
    hasLefthook: config.addons.includes("lefthook"),
    hasCommitlint: config.addons.includes("commitlint"),

    isAiChatApp: config.template === "ai-chat-app",
    isBlank: config.template === "blank",

    environments,
  };
};
