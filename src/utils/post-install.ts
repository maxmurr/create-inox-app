import { createConsola } from "consola";
import pc from "picocolors";
import type { ProjectConfig } from "../types.js";

const consola = createConsola();

export const printPostInstall = (config: ProjectConfig): void => {
  const steps: string[] = [
    `cd ${config.projectName}/${config.projectName}`,
  ];

  if (!config.install) {
    steps.push("bun install");
  }

  steps.push("cp apps/web/.env.example apps/web/.env");

  if (config.database !== "none") {
    steps.push(
      "docker compose --profile dev up -d postgres" +
        (config.cache === "redis" ? " redis" : ""),
    );
    steps.push("cd apps/web && bun run db:migrate");
  } else if (config.cache === "redis") {
    steps.push("docker compose --profile dev up -d redis");
  }

  steps.push("bun run dev");

  consola.box({
    title: pc.bold(pc.magenta("Next steps")),
    message: steps.map((s) => pc.cyan(s)).join("\n"),
    style: {
      borderColor: "magenta",
    },
  });
};
