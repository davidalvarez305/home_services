import React from "react";
import styles from "./RateElement.module.css";

interface Props {
  blocked: string;
  className: string;
}

const RateElement: React.FC<Props> = ({ blocked, className }) => {
  return (
    <div className={styles["rate-element" + ` ${className || ""}`]}>
      <div className={styles["blocked" + " label--14px"]}>{blocked}</div>
      <div className={styles["blocked-title" + " x14px--regular"]}>Rate</div>
    </div>
  );
};

export default RateElement;
