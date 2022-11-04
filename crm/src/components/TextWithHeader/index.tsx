import React from "react";
import styles from "./TextWithHeader.module.css";

interface Props {
  primaryHeader: string;
  subHeader: string;
}

const TextWithHeader: React.FC<Props> = ({ primaryHeader, subHeader }) => {
  return (
    <div className={styles[`header-container`]}>
      <div className={styles["header-paragraph"]}>
        {primaryHeader}
      </div>
      <div className={styles["subheader"]}>
        {subHeader}
      </div>
    </div>
  );
};

export default TextWithHeader;
