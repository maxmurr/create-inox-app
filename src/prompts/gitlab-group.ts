import { navigableText } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";

export const promptGitlabGroup = (): Promise<
  string | typeof GO_BACK_SYMBOL
> => {
  return navigableText({
    message: "What is the GitLab group?",
    placeholder: "aiwg",
    defaultValue: "aiwg",
    isFirstPrompt: false,
  });
};
