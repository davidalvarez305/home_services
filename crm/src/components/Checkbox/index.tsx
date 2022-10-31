import React from "react";
import styles from "./Checkbox.module.css";

interface Props {
  children: React.ReactNode;
}

const Checkbox: React.FC<Props> = ({ children }) => {
  return (
    <div className="forms-general-checkbox-restingon-light">
      <div className="rectangle-3"></div>
      <div className="title x12px--bold">{children}</div>
    </div>
  );
};

export default Checkbox;
