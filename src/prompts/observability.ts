import { navigableSelect } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";
import type { Observability } from "../types.js";

export const promptObservability = async (): Promise<
  Observability | typeof GO_BACK_SYMBOL
> => {
  const result = await navigableSelect({
    message: "Which observability tool would you like to use?",
    options: [
      {
        value: "langfuse",
        label: "Langfuse",
        hint: "LLM observability via OpenTelemetry",
      },
      {
        value: "none",
        label: "None",
        hint: "No observability",
      },
    ],
    initialValue: "langfuse",
  });

  if (result === GO_BACK_SYMBOL) return GO_BACK_SYMBOL;
  return result as Observability;
};
