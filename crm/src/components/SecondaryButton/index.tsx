import React from "react";
import styles from "./SecondaryButton.module.css";

interface Props {
  children?: React.ReactNode;
  icon: string;
  label: string;
}

const SecondaryButton: React.FC<Props> = ({ children, icon, label }) => {
  return (
    <div className={styles["secondary-button"]}>
      <div className={styles["link"]}>
        <div className={styles["icon" + " materialiconsoutlined-regular-normal-black-18px"]}>
          {icon}
        </div>
        <p className={styles["label" + " label--14px"]}>{label}</p>
      </div>
    </div>
  );
};

export default SecondaryButton;
