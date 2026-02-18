import { navigableSelect } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";
import type { Template } from "../types.js";

export const promptTemplate = async (): Promise<
  Template | typeof GO_BACK_SYMBOL
> => {
  const result = await navigableSelect({
    message: "Which template would you like to use?",
    options: [
      {
        value: "ai-chat-app",
        label: "AI Chat App",
        hint: "Next.js 16 + AI SDK + Better Auth + Drizzle + shadcn/ui",
      },
      {
        value: "blank",
        label: "Blank",
        hint: "Minimal Next.js hello-world + health endpoint",
      },
    ],
    initialValue: "ai-chat-app",
    isFirstPrompt: false,
  });

  if (result === GO_BACK_SYMBOL) return GO_BACK_SYMBOL;
  return result as Template;
};
