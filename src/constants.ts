import type { ProjectConfig } from "./types.js";

export const DEFAULT_REGISTRY_HOST = "registry.example.com";
export const DEFAULT_DOMAIN_SUFFIX = "apps.example.com";
export const DEFAULT_GITLAB_URL = "https://gitlab.example.com";

export const DEFAULT_CONFIG: Omit<ProjectConfig, "projectDir"> = {
  projectName: "my-inox-app",
  gitlabGroup: "my-group",
  gitlabUrl: DEFAULT_GITLAB_URL,
  registryHost: DEFAULT_REGISTRY_HOST,
  domainSuffix: DEFAULT_DOMAIN_SUFFIX,
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
  registryHost: string,
  group: string,
  project: string,
  appName: string,
): string => `${registryHost}/${group}/${project}/${appName}-web`;

export const buildDomain = (
  appName: string,
  env: string,
  domainSuffix: string,
): string => `${appName}.${env}.${domainSuffix}`;
