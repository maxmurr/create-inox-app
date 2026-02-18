import { isGoBack, isCancel, GO_BACK_SYMBOL } from "../utils/navigation.js";
import { UserCancelledError } from "../utils/errors.js";

type PromptFn<T> = (
  results: Record<string, unknown>,
) => Promise<T | typeof GO_BACK_SYMBOL> | T | typeof GO_BACK_SYMBOL | undefined;

interface PromptStep {
  key: string;
  fn: PromptFn<unknown>;
}

export const navigableGroup = async (
  steps: PromptStep[],
): Promise<Record<string, unknown>> => {
  const results: Record<string, unknown> = {};
  const shownSteps: number[] = [];
  let i = 0;

  while (i < steps.length) {
    const step = steps[i];
    const result = await step.fn(results);

    if (result === undefined) {
      i++;
      continue;
    }

    if (isGoBack(result)) {
      if (shownSteps.length > 0) {
        const prevIndex = shownSteps.pop()!;
        delete results[steps[prevIndex].key];
        i = prevIndex;
      } else {
        throw new UserCancelledError();
      }
      continue;
    }

    if (isCancel(result)) {
      throw new UserCancelledError();
    }

    results[step.key] = result;
    shownSteps.push(i);
    i++;
  }

  return results;
};
