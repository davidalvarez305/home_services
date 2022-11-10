import { MouseEventHandler } from "react";
import { SingleValue } from "react-select";
import { Line } from "../../assets/Line";
import DeleteButton from "../DeleteIconButton";
import styles from "./SelectedComponent.module.css";

interface Props {
  selected: SingleValue<{
    value?: string | number;
    label?: string;
  }>;
  onClick: MouseEventHandler<SVGElement>;
}

export const SelectedComponent: React.FC<Props> = ({ selected, onClick }) => {
  return (
    <div className={styles["transactions-web-item-v2"]}>
      <div className={styles["flex-row"]}>
        <div className={styles["title"]}>
          <div className={styles["ico"]}>
            <DeleteButton
              size={"sm"}
              width={9}
              height={9}
              aria-label={"removeUsers"}
              className={styles["line"]}
              minusButton={onClick}
            />
          </div>
          <div className={styles["lable"]}>
            <div className={styles["name"]}>{selected?.label}</div>
            <div className={styles["date"]}>{"Florida"}</div>
          </div>
        </div>
      </div>
      <Line />
    </div>
  );
};
