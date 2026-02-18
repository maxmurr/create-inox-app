import { navigableText } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";

export const promptGitlabUrl = (): Promise<
  string | typeof GO_BACK_SYMBOL
> => {
  return navigableText({
    message: "GitLab instance URL?",
    placeholder: "https://gitlab.example.com",
    defaultValue: "https://gitlab.example.com",
    isFirstPrompt: false,
  });
};
