import { z } from "zod";
import type { CliFlags } from "./types.js";

const templateEnum = z.enum(["ai-chat-app", "blank"]);
const databaseEnum = z.enum(["postgresql-paradedb", "none"]);
const cacheEnum = z.enum(["redis", "none"]);
const authEnum = z.enum(["better-auth", "none"]);
const observabilityEnum = z.enum(["langfuse", "none"]);
const environmentEnum = z.enum(["dev", "staging", "production"]);

export const parseFlags = (argv: string[]): CliFlags => {
  if (argv[0] === "history") {
    return { _command: "history", yes: false };
  }

  const flags: CliFlags = { _command: "create", yes: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case "--name":
        flags.name = next;
        i++;
        break;
      case "--gitlab-group":
        flags.gitlabGroup = next;
        i++;
        break;
      case "--template":
        flags.template = templateEnum.parse(next);
        i++;
        break;
      case "--database":
        flags.database = databaseEnum.parse(next);
        i++;
        break;
      case "--cache":
        flags.cache = cacheEnum.parse(next);
        i++;
        break;
      case "--auth":
        flags.auth = authEnum.parse(next);
        i++;
        break;
      case "--observability":
        flags.observability = observabilityEnum.parse(next);
        i++;
        break;
      case "--environments":
        flags.environments = next
          .split(",")
          .map((e) => environmentEnum.parse(e.trim()));
        i++;
        break;
      case "--git":
        flags.git = true;
        break;
      case "--no-git":
        flags.git = false;
        break;
      case "--install":
        flags.install = true;
        break;
      case "--no-install":
        flags.install = false;
        break;
      case "--yes":
      case "-y":
        flags.yes = true;
        break;
      default:
        if (!arg.startsWith("--") && !flags.name) {
          flags.name = arg;
        }
        break;
    }
  }

  return flags;
};

const PROJECT_NAME_RE = /^[a-z0-9][a-z0-9._-]*$/;

export const validateProjectName = (name: string): string | undefined => {
  if (name.length === 0) return "Project name is required";
  if (name.length > 214) return "Project name must be less than 214 characters";
  if (!PROJECT_NAME_RE.test(name))
    return "Must be lowercase, start with letter/number, contain only a-z 0-9 . - _";
  return undefined;
};
