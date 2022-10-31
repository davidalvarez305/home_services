import React from "react";
import styles from "./RateElement.module.css";

interface Props {
  blocked: string;
  className: string;
}

const RateElement: React.FC<Props> = ({ blocked, className }) => {
  return (
    <div className={`rate ${className || ""}`}>
      <div className="blocked-2 lable--14px">{blocked}</div>
      <div className="blocked-title-1 x14px--regular">Rate</div>
    </div>
  );
};

export default RateElement;
