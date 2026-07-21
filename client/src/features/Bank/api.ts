import axiosInstance from "@shared/api/axios";
import { BankFormData } from "@shared/types/types";

type BankRecordPayload = Omit<BankFormData, "_id">;

export const bankApi = {
  getAll: (): Promise<BankFormData[]> =>
    axiosInstance.get("/bank-records").then((r) => r.data),

  create: (data: BankRecordPayload): Promise<BankFormData> =>
    axiosInstance.post("/bank-records", data).then((r) => r.data),

  update: (id: string, data: BankRecordPayload): Promise<void> =>
    axiosInstance.patch(`/bank-records/${id}`, data).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    axiosInstance.delete(`/bank-records/${id}`).then((r) => r.data),
};
