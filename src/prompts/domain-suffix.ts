import { navigableText } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";

export const promptDomainSuffix = (): Promise<
  string | typeof GO_BACK_SYMBOL
> => {
  return navigableText({
    message: "Domain suffix for environments?",
    placeholder: "apps.example.com",
    defaultValue: "apps.example.com",
    isFirstPrompt: false,
  });
};
