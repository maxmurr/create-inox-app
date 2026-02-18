import { navigableConfirm } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";

export const promptGit = async (): Promise<
  boolean | typeof GO_BACK_SYMBOL
> => {
  return navigableConfirm({
    message: "Initialize a git repository?",
    initialValue: true,
  });
};
