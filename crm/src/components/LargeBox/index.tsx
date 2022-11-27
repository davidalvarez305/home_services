import DeleteButton from "../DeleteIconButton";
import styles from "./LargeBox.module.css";

interface Props {
  bottomLeftHeader: string;
  bottomLeftRegularParagraph: string;
  bottomLeftBoldedParagraph: string;
  bottomRightHeader: string;
  topLeftHeader: string;
  topLeftRegularParagraph: string;
}

const LargeBox: React.FC<Props> = ({
  bottomLeftHeader,
  bottomLeftRegularParagraph,
  bottomLeftBoldedParagraph,
  bottomRightHeader,
  topLeftHeader,
  topLeftRegularParagraph,
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
      <div className={styles["bottom-right-container"]}>
        <DeleteButton aria-label={"deleteButton"} />
        <div className={styles["bottom-right-header"]}>{bottomRightHeader}</div>
      </div>
    </div>
  );
};

export default LargeBox;
