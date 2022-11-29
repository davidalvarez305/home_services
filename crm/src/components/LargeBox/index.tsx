import { IconButton } from "@chakra-ui/react";
import DeleteButton from "../DeleteIconButton";
import styles from "./LargeBox.module.css";
import { FiEdit2 } from "react-icons/fi";
import { MouseEventHandler } from "react";

interface Props {
  bottomLeftHeader: string;
  bottomLeftRegularParagraph: string;
  bottomLeftBoldedParagraph: string;
  bottomRightHeader: string;
  topLeftHeader: string;
  topLeftRegularParagraph: string;
  onEdit: MouseEventHandler<HTMLButtonElement> | undefined;
  onDelete: MouseEventHandler<HTMLButtonElement> | undefined
}

const LargeBox: React.FC<Props> = ({
  bottomLeftHeader,
  bottomLeftRegularParagraph,
  bottomLeftBoldedParagraph,
  bottomRightHeader,
  topLeftHeader,
  topLeftRegularParagraph,
  onEdit,
  onDelete
}) => {
  return (
    <div className={styles[`large-box-container`]}>
      <div className={styles["left-box-col"]}>
        <div className={styles["top-left-header"]}>{topLeftHeader}</div>
        <div className={styles["top-left-regular-paragraph"]}>
          {topLeftRegularParagraph}
        </div>
        <h1 className={styles["bottom-left-header"]}>{bottomLeftHeader}</h1>
        <div className={styles["bottom-left-container"]}>
          <div className={styles["bottom-left-regular-paragraph"]}>
            {bottomLeftRegularParagraph}
          </div>
          <div className={styles["bottom-left-bolded-paragraph"]}>
            {bottomLeftBoldedParagraph}
          </div>
        </div>
      </div>
      <div className={styles["right-container"]}>
        <div className={styles["top-right-container"]}>
          <DeleteButton
            aria-label={"deleteButton"}
            onClick={onDelete}
          />
          <IconButton
            icon={<FiEdit2 />}
            aria-label={"edit"}
            variant={"outline"}
            onClick={onEdit}
          />
        </div>
        <div className={styles["bottom-right-header"]}>{bottomRightHeader}</div>
      </div>
    </div>
  );
};

export default LargeBox;
