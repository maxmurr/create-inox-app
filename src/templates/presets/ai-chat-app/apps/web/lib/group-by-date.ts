import { isAfter, isToday, isYesterday, subDays } from "date-fns";

const DATE_GROUPS = ["Today", "Yesterday", "Previous 7 Days", "Previous 30 Days", "Older"] as const;

export type DateGroup = (typeof DATE_GROUPS)[number];

export const groupByDate = <T extends { updatedAt: string | Date }>(
  items: T[],
): { label: DateGroup; items: T[] }[] => {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);

  const grouped = new Map<DateGroup, T[]>();

  for (const item of items) {
    const date = new Date(item.updatedAt);
    let group: DateGroup;

    if (isToday(date)) group = "Today";
    else if (isYesterday(date)) group = "Yesterday";
    else if (isAfter(date, sevenDaysAgo)) group = "Previous 7 Days";
    else if (isAfter(date, thirtyDaysAgo)) group = "Previous 30 Days";
    else group = "Older";

    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(item);
  }

  return DATE_GROUPS.filter((g) => grouped.has(g)).map((label) => ({
    label,
    items: grouped.get(label)!,
  }));
};
