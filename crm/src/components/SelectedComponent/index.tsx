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
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const SelectedComponent: React.FC<Props> = ({ selected, onClick }) => {
  return (
    <div className={styles["main-select-component"]}>
      <div className={styles["flex-row"]}>
        <div className={styles["header"]}>
          <div className={styles["icon"]}>
            <DeleteButton
              size={"sm"}
              width={9}
              height={9}
              aria-label={"removeUsers"}
              className={styles["line"]}
              onClick={onClick}
            />
          </div>
          <div className={styles["label"]}>
            <div className={styles["label-body"]}>{selected?.label}</div>
            <div className={styles["sub-header"]}>{"Florida"}</div>
          </div>
        </div>
      </div>
      <Line />
    </div>
  );
};
