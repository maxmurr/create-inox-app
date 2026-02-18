import { resolve } from "node:path";
import type {
  Addon,
  Auth,
  Cache,
  CliFlags,
  Database,
  Environment,
  Observability,
  ProjectConfig,
  Template,
} from "../types.js";
import { DEFAULT_CONFIG } from "../constants.js";
import { navigableGroup } from "./navigable-group.js";
import { promptProjectName } from "./project-name.js";
import { promptGitlabGroup } from "./gitlab-group.js";
import { promptTemplate } from "./template.js";
import { promptDatabase } from "./database.js";
import { promptCache } from "./cache.js";
import { promptAuth } from "./auth.js";
import { promptObservability } from "./observability.js";
import { promptEnvironments } from "./environments.js";
import { promptAddons } from "./addons.js";
import { promptGit } from "./git.js";
import { promptInstall } from "./install.js";

export const gatherConfig = async (flags: CliFlags): Promise<ProjectConfig> => {
  if (flags.yes) {
    const name = flags.name ?? DEFAULT_CONFIG.projectName;
    return {
      ...DEFAULT_CONFIG,
      projectName: name,
      gitlabGroup: flags.gitlabGroup ?? DEFAULT_CONFIG.gitlabGroup,
      template: flags.template ?? DEFAULT_CONFIG.template,
      database: flags.database ?? DEFAULT_CONFIG.database,
      cache: flags.cache ?? DEFAULT_CONFIG.cache,
      auth: flags.auth ?? DEFAULT_CONFIG.auth,
      observability: flags.observability ?? DEFAULT_CONFIG.observability,
      environments: flags.environments ?? DEFAULT_CONFIG.environments,
      git: flags.git ?? DEFAULT_CONFIG.git,
      install: flags.install ?? DEFAULT_CONFIG.install,
      projectDir: resolve(process.cwd(), name),
    };
  }

  const results = await navigableGroup([
    {
      key: "projectName",
      fn: () => flags.name ?? promptProjectName(true),
    },
    {
      key: "gitlabGroup",
      fn: () => flags.gitlabGroup ?? promptGitlabGroup(),
    },
    {
      key: "template",
      fn: () => flags.template ?? promptTemplate(),
    },
    {
      key: "database",
      fn: (r) => {
        if ((r.template as Template) === "blank") return "none";
        return flags.database ?? promptDatabase();
      },
    },
    {
      key: "cache",
      fn: (r) => {
        if ((r.template as Template) === "blank") return "none";
        return flags.cache ?? promptCache();
      },
    },
    {
      key: "auth",
      fn: (r) => {
        if ((r.template as Template) === "blank") return "none";
        return flags.auth ?? promptAuth();
      },
    },
    {
      key: "observability",
      fn: (r) => {
        if ((r.template as Template) === "blank") return "none";
        return flags.observability ?? promptObservability();
      },
    },
    {
      key: "environments",
      fn: () => flags.environments ?? promptEnvironments(),
    },
    {
      key: "addons",
      fn: () => promptAddons(),
    },
    {
      key: "git",
      fn: () => (flags.git !== undefined ? flags.git : promptGit()),
    },
    {
      key: "install",
      fn: () => (flags.install !== undefined ? flags.install : promptInstall()),
    },
  ]);

  const projectName =
    (results.projectName as string) ?? DEFAULT_CONFIG.projectName;

  return {
    projectName,
    gitlabGroup: (results.gitlabGroup as string) ?? DEFAULT_CONFIG.gitlabGroup,
    template: (results.template as Template) ?? DEFAULT_CONFIG.template,
    database: (results.database as Database) ?? DEFAULT_CONFIG.database,
    cache: (results.cache as Cache) ?? DEFAULT_CONFIG.cache,
    auth: (results.auth as Auth) ?? DEFAULT_CONFIG.auth,
    observability:
      (results.observability as Observability) ?? DEFAULT_CONFIG.observability,
    environments:
      (results.environments as Environment[]) ?? DEFAULT_CONFIG.environments,
    addons: (results.addons as Addon[]) ?? DEFAULT_CONFIG.addons,
    git: (results.git as boolean) ?? DEFAULT_CONFIG.git,
    install: (results.install as boolean) ?? DEFAULT_CONFIG.install,
    projectDir: resolve(process.cwd(), projectName),
  };
};
