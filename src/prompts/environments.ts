import { navigableMultiselect } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";
import type { Environment } from "../types.js";

export const promptEnvironments = async (): Promise<
  Environment[] | typeof GO_BACK_SYMBOL
> => {
  const result = await navigableMultiselect({
    message: "Which environments do you need?",
    options: [
      { value: "dev", label: "Development" },
      { value: "staging", label: "Staging" },
      { value: "production", label: "Production" },
    ],
    initialValues: ["staging"],
    required: true,
  });

  if (result === GO_BACK_SYMBOL) return GO_BACK_SYMBOL;
  return result as Environment[];
};
