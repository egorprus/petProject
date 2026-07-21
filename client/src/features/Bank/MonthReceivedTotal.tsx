import { useEffect, useState } from "react";
import { BankFormData } from "@shared/types/types";
import { getRateForDate } from "./exchangeRateCache";

export const MonthReceivedTotal = ({ items }: { items: { item: BankFormData }[] }) => {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTotal = async () => {
      setTotal(null);
      let sum = 0;

      for (const { item } of items) {
        const rate = item.rate ?? await getRateForDate(item.date);
        sum += Number(item.received) / rate;
      }

      if (!cancelled) setTotal(sum);
    };

    fetchTotal();
    return () => { cancelled = true; };
  }, [items]);

  if (total === null) return <span>...</span>;
  return <strong>${total.toFixed(2)}</strong>;
};
