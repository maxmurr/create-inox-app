import { execa } from "execa";

export const gitInit = async (projectDir: string): Promise<void> => {
  await execa("git", ["init"], { cwd: projectDir });
  await execa("git", ["add", "."], { cwd: projectDir });
  await execa("git", ["commit", "-m", "chore: initial scaffold via create-inox-app"], {
    cwd: projectDir,
  });
};
