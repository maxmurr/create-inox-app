import { writeFileSync, mkdirSync, chmodSync, symlinkSync, readdirSync } from "node:fs";
import { join, dirname, extname } from "node:path";

export const writeFiles = (
  projectDir: string,
  files: Map<string, string>,
): void => {
  for (const [relPath, content] of files) {
    const absPath = join(projectDir, relPath);
    mkdirSync(dirname(absPath), { recursive: true });
    writeFileSync(absPath, content);

    if (extname(absPath) === ".sh") {
      chmodSync(absPath, 0o755);
    }
  }
};

export const linkSkills = (projectDir: string): void => {
  const agentsDir = join(projectDir, ".agents", "skills");
  const claudeSkillsDir = join(projectDir, ".claude", "skills");

  try {
    const skills = readdirSync(agentsDir);
    mkdirSync(claudeSkillsDir, { recursive: true });
    for (const skill of skills) {
      symlinkSync(
        join("..", "..", ".agents", "skills", skill),
        join(claudeSkillsDir, skill),
      );
    }
  } catch {
    // .agents/skills may not exist for some configurations
  }
};

export const mergeFiles = (
  target: Map<string, string>,
  source: Map<string, string>,
): void => {
  for (const [key, value] of source) {
    target.set(key, value);
  }
};

export const prefixFiles = (
  prefix: string,
  files: Map<string, string>,
): Map<string, string> => {
  const result = new Map<string, string>();
  for (const [key, value] of files) {
    result.set(join(prefix, key), value);
  }
  return result;
};

export const stripPrefix = (
  prefix: string,
  files: Map<string, string>,
): Map<string, string> => {
  const result = new Map<string, string>();
  const p = prefix.endsWith("/") ? prefix : `${prefix}/`;
  for (const [key, value] of files) {
    if (key.startsWith(p)) {
      result.set(key.slice(p.length), value);
    }
  }
  return result;
};
