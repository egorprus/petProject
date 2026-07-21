import styles from "./style.module.scss";
import { MonthReceivedTotal } from "@features/Bank/MonthReceivedTotal";
import { BankActionAdd } from "@features/Bank/BankActionAdd";
import { BankList } from "@features/Bank/BankList";
import { useBankData } from "@features/Bank/useBankData";

export const BankPage = () => {
  const { bankData, grouped, totalExpected, handleAdd, handleEdit, handleDelete } =
    useBankData();

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1>Bank</h1>
          <BankActionAdd onSubmit={handleAdd} />
        </div>
        <div className={styles.totals}>
          <p>Total expected: <strong>${totalExpected}</strong></p>
          <p>
            Total received:{" "}
            <MonthReceivedTotal items={bankData.map((item) => ({ item }))} />
          </p>
        </div>
      </div>

      <BankList grouped={grouped} onEdit={handleEdit} onDelete={handleDelete} />
    </section>
  );
};
