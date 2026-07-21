import { useEffect, useState } from "react";
import { getRateForDate } from "./exchangeRateCache";

interface Props {
  sumBy: string;
  date: string;
  rate?: number;
}

export const ReceivedValue = ({ sumBy, date, rate }: Props) => {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (rate !== undefined) {
      setValue(Number(sumBy) / rate);
      return;
    }
    getRateForDate(date).then(r => setValue(Number(sumBy) / r));
  }, [sumBy, date, rate]);

  if (value === null) return <span>...</span>;
  return <strong>{value.toFixed(2)}</strong>;
}
