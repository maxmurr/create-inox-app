import { execa } from "execa";

export const installDeps = async (projectDir: string): Promise<void> => {
  await execa("bun", ["install"], { cwd: projectDir });
};
