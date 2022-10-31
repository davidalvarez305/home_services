import React from "react";
import styles from "./TextWithHeader.module.css";

interface Props {
  primaryHeader: string;
  subHeader: string;
}

const TextWithHeader: React.FC<Props> = ({ primaryHeader, subHeader }) => {
  return (
    <div className={`account-1`}>
      <div className="deposit-name lable--14px">{primaryHeader}</div>
      <div className="account-title-1 x14px--regular">{subHeader}</div>
    </div>
  );
};

export default TextWithHeader;
