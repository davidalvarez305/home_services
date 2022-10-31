import React from "react";
import styles from "./Checkbox.module.css";

interface Props {
  children: React.ReactNode;
}

const Checkbox: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles["general-checkbox"]}>
      <div className={styles["rectangle"]}></div>
      <div className={styles["title"] + " x12px--bold"}>{children}</div>
    </div>
  );
};

export default Checkbox;
