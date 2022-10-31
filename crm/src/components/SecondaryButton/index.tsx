import React from "react";
import styles from "./SecondaryButton.module.css";

interface Props {
  children?: React.ReactNode;
  icon: string;
  label: string;
}

const SecondaryButton: React.FC<Props> = ({ children, icon, label }) => {
  return (
    <div className="buttons-icon-label-o">
      <div className="link">
        <div className="icon-2 materialiconsoutlined-regular-normal-black-18px">
          {icon}
        </div>
        <p className="label-1 lable--14px">{label}</p>
      </div>
    </div>
  );
};

export default SecondaryButton;
