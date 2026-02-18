import { intro, outro, log } from "@clack/prompts";
import pc from "picocolors";
import { renderTitle } from "./utils/render-title.js";
import { parseFlags } from "./validation.js";
import { gatherConfig } from "./prompts/config-prompts.js";
import { scaffold } from "./scaffolder/scaffold.js";
import { printPostInstall } from "./utils/post-install.js";
import { buildReproducibleCmd } from "./utils/reproducible-cmd.js";
import { UserCancelledError } from "./utils/errors.js";

export const createInoxCli = async (): Promise<void> => {
  const flags = parseFlags(process.argv.slice(2));

  if (flags._command === "history") {
    log.info("History command not yet implemented");
    return;
  }

  renderTitle();
  intro(pc.red("Create a new Inox project"));

  try {
    const config = await gatherConfig(flags);

    log.info(
      [
        "",
        `  ${pc.bold("Project")}:    ${pc.cyan(config.projectName)}`,
        `  ${pc.bold("Group")}:      ${pc.cyan(config.gitlabGroup)}`,
        `  ${pc.bold("Template")}:   ${pc.cyan(config.template)}`,
        `  ${pc.bold("Database")}:   ${pc.cyan(config.database)}`,
        `  ${pc.bold("Cache")}:      ${pc.cyan(config.cache)}`,
        `  ${pc.bold("Auth")}:       ${pc.cyan(config.auth)}`,
        `  ${pc.bold("Observe")}:    ${pc.cyan(config.observability)}`,
        `  ${pc.bold("Envs")}:       ${pc.cyan(config.environments.join(", "))}`,
        `  ${pc.bold("Addons")}:     ${pc.cyan(config.addons.join(", ") || "none")}`,
        "",
      ].join("\n"),
    );

    await scaffold(config);

    log.info(pc.dim(buildReproducibleCmd(config)));

    outro(pc.red("Happy building!"));

    printPostInstall(config);
  } catch (err) {
    if (err instanceof UserCancelledError) {
      outro(pc.red("Operation cancelled"));
      process.exit(0);
    }
    throw err;
  }
};
