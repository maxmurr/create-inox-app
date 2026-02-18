import { navigableText } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";

export const promptRegistryHost = (): Promise<
  string | typeof GO_BACK_SYMBOL
> => {
  return navigableText({
    message: "Docker registry host?",
    placeholder: "registry.example.com",
    defaultValue: "registry.example.com",
    isFirstPrompt: false,
  });
};
