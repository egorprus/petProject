import { BankFormData } from "@shared/types/types";
import { useEffect, useMemo, useState } from "react";
import { getRateForDate } from "./exchangeRateCache";
import { groupByYearAndMonth } from "./bankUtils";
import { bankApi } from "./api";

export const useBankData = () => {
  const [bankData, setBankData] = useState<BankFormData[]>([]);

  useEffect(() => {
    bankApi.getAll().then((data) => setBankData(Array.isArray(data) ? data : []));
  }, []);

  const grouped = useMemo(() => groupByYearAndMonth(bankData), [bankData]);

  const totalExpected = useMemo(
    () =>
      grouped.reduce(
        (sum, { months }) =>
          sum + months.reduce((s, { items }) => s + Number(items[0].item.expected), 0),
        0
      ),
    [grouped]
  );

  const handleAdd = async (data: BankFormData) => {
    const rate = await getRateForDate(data.date);
    const created = await bankApi.create({ ...data, rate });
    setBankData((prev) => [...prev, created]);
  };

  const handleEdit = async (id: string, data: BankFormData) => {
    const rate = await getRateForDate(data.date);
    await bankApi.update(id, { ...data, rate });
    setBankData((prev) =>
      prev.map((item) => (item._id === id ? { ...data, _id: id, rate } : item))
    );
  };

  const handleDelete = async (id: string) => {
    await bankApi.remove(id);
    setBankData((prev) => prev.filter((item) => item._id !== id));
  };

  return { bankData, grouped, totalExpected, handleAdd, handleEdit, handleDelete };
};
