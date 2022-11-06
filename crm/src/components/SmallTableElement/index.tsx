import { MouseEventHandler } from "react";
import styles from "./SmallTableElement.module.css";

interface Props {
  children: React.ReactNode;
}

const SmallTableElement: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles["table-element-container"]}>
      <div className={styles["flex-row"]}>
        <div className={styles["title"]}>
          <div className={styles["label"]}>
            <div className={styles["name"]}>{children}</div>
            <div className={styles["date"]}>{"lastUpdated"}</div>
          </div>
        </div>
      </div>
      <div className={styles["line"]} />
    </div>
  );
};

export default SmallTableElement;
