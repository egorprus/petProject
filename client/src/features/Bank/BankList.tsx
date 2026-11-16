import { BankActionAdd } from "@features/Bank/BankActionAdd";
import { FaTrash } from "react-icons/fa";
import { Collapsible } from "@shared/ui/Collapsible/Collapsible";
import { BankFormData } from "@shared/types/types";
import { GroupedByYear } from "@features/Bank/bankUtils";
import { ReceivedValue } from "@features/Bank/ReceivedValue";
import { MonthReceivedTotal } from "@features/Bank/MonthReceivedTotal";
import styles from "@pages/Bank/style.module.scss";

interface Props {
  grouped: GroupedByYear[];
  onEdit: (id: string, data: BankFormData) => void;
  onDelete: (id: string) => void;
}

export const BankList = ({ grouped, onEdit, onDelete }: Props) => (
  <div className={styles.yearGrid}>
    {grouped.map(({ year, months }) => (
      <Collapsible
        key={year}
        title={
          <span className={styles.monthTitleContent}>
            {year}
            <span className={styles.monthExpected}>
              expected: {months.reduce((sum, { items }) => sum + Number(items[0].item.expected), 0)}
            </span>
            <span className={styles.monthExpected}>
              received: <MonthReceivedTotal items={months.flatMap(({ items }) => items)} />
            </span>
          </span>
        }
        as="h2"
        className={styles.yearGroup}
        titleClassName={styles.yearTitle}
      >
        {months.map(({ month, items }) => (
          <Collapsible
            key={month}
            title={
              <span className={styles.monthTitleContent}>
                {month}
                <span className={styles.monthExpected}>
                  expected: {items[0].item.expected}
                </span>
                <span className={styles.monthExpected}>
                  received: <MonthReceivedTotal items={items} />
                </span>
              </span>
            }
            as="h3"
            className={styles.monthGroup}
            titleClassName={styles.monthTitle}
          >
            <ul className={styles.list}>
              {items.map(({ item }) => (
                <li key={item._id} className={styles.listItem}>
                  <span className={styles.itemLabel}>
                    <span>
                      {new Date(item.date).getDate()} received: <ReceivedValue sumBy={item.received} date={item.date} rate={item.rate} />
                    </span>
                  </span>
                  <BankActionAdd item={item} onSubmit={(data) => onEdit(item._id!, data)} />
                  <button className={styles.iconButton} onClick={() => onDelete(item._id!)}>
                    <FaTrash size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </Collapsible>
        ))}
      </Collapsible>
    ))}
  </div>
);
