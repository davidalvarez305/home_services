import { MouseEventHandler } from "react";
import styles from "./SmallTableElement.module.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

interface Props {
  children: React.ReactNode;
  minusButton: MouseEventHandler<SVGElement>;
  plusButton: MouseEventHandler<SVGElement>;
}

const SmallTableElement: React.FC<Props> = ({
  children,
  minusButton,
  plusButton,
}) => {
  return (
    <div className={styles["table-element-container"]}>
      <div className={styles["flex-row"]}>
        <div className={styles["title"]}>
          <div className={styles["label"]}>
            <div className={styles["name"]}>{children}</div>
          </div>
        </div>
        <button className={styles["icon-button"]}>
          <AiOutlinePlus type="button" onClick={plusButton} />
        </button>
        <button className={styles["icon-button"]}>
          <AiOutlineMinus type="button" onClick={minusButton} />
        </button>
      </div>
    </div>
  );
};

export default SmallTableElement;
