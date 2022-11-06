import React, { useState } from "react";
import styles from "./SidebarElement.module.css";

interface Props {
  link: string;
  icon: React.ReactNode;
  label: string;
  handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const SidebarElement: React.FC<Props> = ({ link, icon, label, handleClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div className={styles["navigation-element"]}>
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ cursor: isHovering ? "pointer" : undefined }}
        className={styles["label"]}
        onClick={(e) => handleClick(e)}
      >
        <div className={styles["flag-button"]}>{icon}</div>
        <div className={styles["link"]}>{label}</div>
      </div>
    </div>
  );
};

export default SidebarElement;
