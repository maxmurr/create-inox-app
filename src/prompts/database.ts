import { navigableSelect } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";
import type { Database } from "../types.js";

export const promptDatabase = async (): Promise<
  Database | typeof GO_BACK_SYMBOL
> => {
  const result = await navigableSelect({
    message: "Which database would you like to use?",
    options: [
      {
        value: "postgresql-paradedb",
        label: "PostgreSQL (ParadeDB)",
        hint: "ParadeDB + Drizzle ORM",
      },
      {
        value: "none",
        label: "None",
        hint: "No database",
      },
    ],
    initialValue: "postgresql-paradedb",
  });

  if (result === GO_BACK_SYMBOL) return GO_BACK_SYMBOL;
  return result as Database;
};
