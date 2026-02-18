import gradient from "gradient-string";

const TITLE_TEXT = `
  ██╗███╗   ██╗ ██████╗ ██╗  ██╗
  ██║████╗  ██║██╔═══██╗╚██╗██╔╝
  ██║██╔██╗ ██║██║   ██║ ╚███╔╝
  ██║██║╚██╗██║██║   ██║ ██╔██╗
  ██║██║ ╚████║╚██████╔╝██╔╝ ██╗
  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝
`;

const INOX_THEME = {
  blue: "#3B82F6",
  cyan: "#06B6D4",
  teal: "#14B8A6",
  green: "#22C55E",
  lime: "#84CC16",
  yellow: "#EAB308",
  orange: "#F97316",
};

export const renderTitle = (): void => {
  const cols = process.stdout.columns ?? 80;

  if (cols < 40) {
    const g = gradient(Object.values(INOX_THEME));
    console.log(g("  INOX CREATE"));
  } else {
    const g = gradient(Object.values(INOX_THEME));
    console.log(g.multiline(TITLE_TEXT));
  }
};
