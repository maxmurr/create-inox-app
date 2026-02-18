import { navigableSelect } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";
import type { Auth } from "../types.js";

export const promptAuth = async (): Promise<
  Auth | typeof GO_BACK_SYMBOL
> => {
  const result = await navigableSelect({
    message: "Which authentication would you like to use?",
    options: [
      {
        value: "better-auth",
        label: "Better Auth",
        hint: "TypeScript-first auth framework",
      },
      {
        value: "none",
        label: "None",
        hint: "No authentication",
      },
    ],
    initialValue: "better-auth",
  });

  if (result === GO_BACK_SYMBOL) return GO_BACK_SYMBOL;
  return result as Auth;
};
