import { navigableGroupMultiselect } from "./navigable.js";
import { GO_BACK_SYMBOL } from "../utils/navigation.js";
import type { Addon } from "../types.js";

export const promptAddons = async (): Promise<
  Addon[] | typeof GO_BACK_SYMBOL
> => {
  const result = await navigableGroupMultiselect({
    message: "Select addons (space to toggle, enter to confirm)",
    options: {
      Tooling: [
        { value: "turborepo", label: "Turborepo", hint: "Monorepo build system" },
        { value: "oxlint", label: "Oxlint", hint: "Fast linter" },
        { value: "oxfmt", label: "Oxfmt", hint: "Fast formatter" },
        { value: "lefthook", label: "Lefthook", hint: "Git hooks manager" },
        { value: "commitlint", label: "Commitlint", hint: "Conventional commits" },
      ],
      Infrastructure: [
        { value: "ingress", label: "Ingress", hint: "Nginx ingress controller" },
        { value: "tls", label: "TLS", hint: "cert-manager with Let's Encrypt" },
        { value: "pvc", label: "PVC Storage", hint: "Persistent volume claims" },
      ],
    },
  });

  if (result === GO_BACK_SYMBOL) return GO_BACK_SYMBOL;
  return result as Addon[];
};
