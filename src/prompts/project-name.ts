import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { navigableText } from "./navigable.js";
import { validateProjectName } from "../validation.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";

const findAvailableName = (base: string): string => {
  if (!existsSync(resolve(process.cwd(), base))) return base;
  let i = 1;
  while (existsSync(resolve(process.cwd(), `${base}-${i}`))) i++;
  return `${base}-${i}`;
};

export const promptProjectName = (
  isFirst: boolean,
): Promise<string | typeof GO_BACK_SYMBOL> => {
  const defaultName = findAvailableName("my-inox-app");
  return navigableText({
    message: "What is your project name?",
    placeholder: defaultName,
    defaultValue: defaultName,
    validate: validateProjectName,
    isFirstPrompt: isFirst,
  });
};
