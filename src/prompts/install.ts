import { navigableConfirm } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";

export const promptInstall = async (): Promise<
  boolean | typeof GO_BACK_SYMBOL
> => {
  return navigableConfirm({
    message: "Install dependencies?",
    initialValue: true,
  });
};
