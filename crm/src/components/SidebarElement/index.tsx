import React, { useState } from "react";
import styles from "./SidebarElement.module.css";

interface Props {
  link: string;
  icon: React.ReactNode;
  handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const SidebarElement: React.FC<Props> = ({ link, icon, handleClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div className="navigation-web-sideb-10">
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ cursor: isHovering ? "pointer" : undefined }}
        className="label"
        onClick={(e) => handleClick(e)}
      >
        <div className="buttons-logo-flag-usd">{icon}</div>
        <div className="link-3 label--14px">{link}</div>
      </div>
    </div>
  );
};

export default SidebarElement;
