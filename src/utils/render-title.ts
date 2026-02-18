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
  red: "#D20000",
  warmRed: "#E83600",
  orange: "#F06800",
  amber: "#F59E0B",
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
