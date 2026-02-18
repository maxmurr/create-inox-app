import type { ProjectConfig } from "./types.js";

export const REGISTRY_HOST = "gitlab.inox.co.th:4567";
export const DOMAIN_SUFFIX = "poring.arkcube.com";

export const DEFAULT_CONFIG: Omit<ProjectConfig, "projectDir"> = {
  projectName: "my-inox-app",
  gitlabGroup: "aiwg",
  template: "ai-chat-app",
  database: "postgresql-paradedb",
  cache: "redis",
  auth: "better-auth",
  observability: "langfuse",
  environments: ["staging"],
  addons: [
    "turborepo",
    "oxlint",
    "oxfmt",
    "lefthook",
    "commitlint",
    "ingress",
    "tls",
    "pvc",
  ],
  git: true,
  install: true,
};

export const buildRegistryImage = (
  group: string,
  project: string,
  appName: string,
): string => `${REGISTRY_HOST}/${group}/${project}/${appName}-web`;

export const buildDomain = (appName: string, env: string): string =>
  `${appName}.${env}.${DOMAIN_SUFFIX}`;
