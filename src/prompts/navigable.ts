import * as clack from "@clack/prompts";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";

export const navigableText = async (opts: {
  message: string;
  placeholder?: string;
  defaultValue?: string;
  validate?: (value: string) => string | undefined;
  isFirstPrompt?: boolean;
}): Promise<string | typeof GO_BACK_SYMBOL> => {
  const result = await clack.text({
    message: opts.message,
    placeholder: opts.placeholder,
    defaultValue: opts.defaultValue,
    validate: opts.validate,
  });

  if (clack.isCancel(result)) return GO_BACK_SYMBOL;
  return result || opts.defaultValue || "";
};

export const navigableSelect = async (opts: {
  message: string;
  options: { value: string; label?: string; hint?: string }[];
  initialValue?: string;
  isFirstPrompt?: boolean;
}): Promise<string | typeof GO_BACK_SYMBOL> => {
  const result = await clack.select({
    message: opts.message,
    options: opts.options,
    initialValue: opts.initialValue,
  });

  if (clack.isCancel(result)) return GO_BACK_SYMBOL;
  return result as string;
};

export const navigableMultiselect = async (opts: {
  message: string;
  options: { value: string; label?: string; hint?: string }[];
  initialValues?: string[];
  required?: boolean;
  isFirstPrompt?: boolean;
}): Promise<string[] | typeof GO_BACK_SYMBOL> => {
  const result = await clack.multiselect({
    message: opts.message,
    options: opts.options,
    initialValues: opts.initialValues,
    required: opts.required ?? false,
  });

  if (clack.isCancel(result)) return GO_BACK_SYMBOL;
  return result as string[];
};

export const navigableConfirm = async (opts: {
  message: string;
  initialValue?: boolean;
  isFirstPrompt?: boolean;
}): Promise<boolean | typeof GO_BACK_SYMBOL> => {
  const result = await clack.confirm({
    message: opts.message,
    initialValue: opts.initialValue ?? true,
  });

  if (clack.isCancel(result)) return GO_BACK_SYMBOL;
  return result;
};

export const navigableGroupMultiselect = async (opts: {
  message: string;
  options: Record<string, { value: string; label?: string; hint?: string }[]>;
  initialValues?: string[];
  isFirstPrompt?: boolean;
}): Promise<string[] | typeof GO_BACK_SYMBOL> => {
  const result = await clack.groupMultiselect({
    message: opts.message,
    options: opts.options,
    required: false,
  });

  if (clack.isCancel(result)) return GO_BACK_SYMBOL;
  return result as string[];
};
