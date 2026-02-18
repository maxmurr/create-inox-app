import { navigableSelect } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";
import type { Cache } from "../types.js";

export const promptCache = async (): Promise<
  Cache | typeof GO_BACK_SYMBOL
> => {
  const result = await navigableSelect({
    message: "Which cache would you like to use?",
    options: [
      {
        value: "redis",
        label: "Redis",
        hint: "In-memory data store",
      },
      {
        value: "none",
        label: "None",
        hint: "No cache",
      },
    ],
    initialValue: "redis",
  });

  if (result === GO_BACK_SYMBOL) return GO_BACK_SYMBOL;
  return result as Cache;
};
