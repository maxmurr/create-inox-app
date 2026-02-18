import type { ProjectConfig } from "../types.js";
import { DEFAULT_CONFIG } from "../constants.js";

export const buildReproducibleCmd = (config: ProjectConfig): string => {
  const parts: string[] = ["bunx create-inox-app"];

  parts.push(`--name ${config.projectName}`);

  if (config.gitlabGroup !== DEFAULT_CONFIG.gitlabGroup) {
    parts.push(`--gitlab-group ${config.gitlabGroup}`);
  }

  if (config.gitlabUrl !== DEFAULT_CONFIG.gitlabUrl) {
    parts.push(`--gitlab-url ${config.gitlabUrl}`);
  }

  if (config.registryHost !== DEFAULT_CONFIG.registryHost) {
    parts.push(`--registry-host ${config.registryHost}`);
  }

  if (config.domainSuffix !== DEFAULT_CONFIG.domainSuffix) {
    parts.push(`--domain-suffix ${config.domainSuffix}`);
  }

  parts.push(`--template ${config.template}`);

  if (config.database !== "none") {
    parts.push(`--database ${config.database}`);
  } else {
    parts.push("--database none");
  }

  if (config.cache !== "none") {
    parts.push(`--cache ${config.cache}`);
  } else {
    parts.push("--cache none");
  }

  if (config.auth !== "none") {
    parts.push(`--auth ${config.auth}`);
  } else {
    parts.push("--auth none");
  }

  if (config.observability !== "none") {
    parts.push(`--observability ${config.observability}`);
  } else {
    parts.push("--observability none");
  }

  parts.push(`--environments ${config.environments.join(",")}`);

  if (!config.git) parts.push("--no-git");
  if (!config.install) parts.push("--no-install");

  return parts.join(" \\\n  ");
};
