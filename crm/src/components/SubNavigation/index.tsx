import React from "react";
import SubNavigationElement from "../SubNavigationElement";
import styles from "./SubNavigation.module.css";

interface Props {
  elements: any[];
}

const SubNavigation: React.FC<Props> = ({ elements }) => {
  return (
    <div className={styles["bar-container"]}>
      <div className={styles["list"]}>
        {elements.map((el) => (
          <React.Fragment key={el}>
            <SubNavigationElement label={el} />
          </React.Fragment>
        ))}
      </div>
      <div className={styles["line"]} />
    </div>
  );
};

export default SubNavigation;
