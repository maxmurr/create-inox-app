export const GO_BACK_SYMBOL = Symbol("GO_BACK");

export const isGoBack = (value: unknown): value is typeof GO_BACK_SYMBOL =>
  value === GO_BACK_SYMBOL;

export const isCancel = (value: unknown): value is symbol =>
  typeof value === "symbol" && value !== GO_BACK_SYMBOL;
