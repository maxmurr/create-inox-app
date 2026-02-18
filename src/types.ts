export type Template = "ai-chat-app" | "blank";
export type Database = "postgresql-paradedb" | "none";
export type Cache = "redis" | "none";
export type Auth = "better-auth" | "none";
export type Observability = "langfuse" | "none";
export type Environment = "dev" | "staging" | "production";

export type ToolingAddon =
  | "turborepo"
  | "oxlint"
  | "oxfmt"
  | "lefthook"
  | "commitlint";

export type InfraAddon = "ingress" | "tls" | "pvc";

export type Addon = ToolingAddon | InfraAddon;

export interface ProjectConfig {
  projectName: string;
  gitlabGroup: string;
  template: Template;
  database: Database;
  cache: Cache;
  auth: Auth;
  observability: Observability;
  environments: Environment[];
  addons: Addon[];
  git: boolean;
  install: boolean;
  projectDir: string;
}

export interface TemplateContext {
  projectName: string;
  appName: string;
  gitlabGroup: string;
  registryImage: string;

  hasDatabase: boolean;
  isParadedb: boolean;
  hasRedis: boolean;
  hasAuth: boolean;
  hasLangfuse: boolean;

  hasIngress: boolean;
  hasTls: boolean;
  hasPvc: boolean;

  hasTurborepo: boolean;
  hasOxlint: boolean;
  hasOxfmt: boolean;
  hasLefthook: boolean;
  hasCommitlint: boolean;

  isAiChatApp: boolean;
  isBlank: boolean;

  environments: Array<{
    name: string;
    domain: string;
    isFirst: boolean;
    isLast: boolean;
  }>;
}

export interface CliFlags {
  _command: "create" | "history";
  name?: string;
  gitlabGroup?: string;
  template?: Template;
  database?: Database;
  cache?: Cache;
  auth?: Auth;
  observability?: Observability;
  environments?: Environment[];
  git?: boolean;
  install?: boolean;
  yes: boolean;
}
