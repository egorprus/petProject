import { BankFormData } from "@shared/types/types";

export type GroupedByYear = {
  year: string;
  months: { month: string; items: { item: BankFormData }[] }[];
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function groupByYearAndMonth(data: BankFormData[]): GroupedByYear[] {
  const yearMap = new Map<string, Map<string, { item: BankFormData }[]>>();

  data.forEach((item) => {
    const d = new Date(item.date);
    const year = String(d.getFullYear());
    const monthIndex = d.getMonth();
    const month = `${String(monthIndex + 1).padStart(2, "0")}_${MONTH_NAMES[monthIndex]}`;

    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const monthMap = yearMap.get(year)!;
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push({ item });
  });

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, monthMap]) => ({
      year,
      months: Array.from(monthMap.entries())
        .sort(([a], [b]) => a.localeCompare(b) * -1)
        .map(([month, items]) => ({
          month: month.split("_")[1],
          items: items.sort((a, b) => new Date(b.item.date).getTime() - new Date(a.item.date).getTime()),
        })),
    }));
}
