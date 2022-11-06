import { MouseEventHandler } from "react";
import styles from "./SmallTableElement.module.css";
import { GrClose } from "react-icons/gr";
import { IconButton } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  minusButton: MouseEventHandler<SVGElement>;
}

const SmallTableElement: React.FC<Props> = ({ children, minusButton }) => {
  return (
    <div className={styles["table-element-container"]}>
      <div className={styles["flex-row"]}>
        <div className={styles["title"]}>
          <div className={styles["label"]}>
            <div className={styles["name"]}>{children}</div>
            <div className={styles["date"]}>{"lastUpdated"}</div>
          </div>
        </div>
        <IconButton
          aria-label={"removeUsers"}
          icon={<GrClose size={20} onClick={minusButton} />}
          variant={"outline"}
          colorScheme={"red"}
        />
      </div>
      <div className={styles["line"]} />
    </div>
  );
};

export default SmallTableElement;
