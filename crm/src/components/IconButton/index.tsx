import React from "react";
import styles from "./IconButton.module.css";

interface Props {
  children: React.ReactNode;
}

const IconButton: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles["icon-button"]}>
      <div className={styles["icon-2" + " materialiconsoutlined-regular-normal-black-18px"]}>
        {children}
      </div>
    </div>
  );
};

export default IconButton;