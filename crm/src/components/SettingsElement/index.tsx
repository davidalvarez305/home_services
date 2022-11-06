import React from "react";
import styles from "./SettingsElement.module.css";
import TextWithHeader from "../TextWithHeader";
import TagElement from "../TagElement";

interface Props {
  icon: React.ReactNode;
  primaryHeader: string;
  subHeader: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  tagText: string;
  isLoading?: boolean;
  loadingText?: string;
}

const SettingsElement: React.FC<Props> = ({
  icon,
  primaryHeader,
  subHeader,
  handleClick,
  tagText,
  isLoading,
  loadingText,
}) => {
  return (
    <div className={styles["settings-element"]}>
      <div className={styles["options"]}>
        <div className={styles["icon"]}>{icon}</div>
        <TextWithHeader primaryHeader={primaryHeader} subHeader={subHeader} />
      </div>
      <TagElement
        tag={tagText}
        handleClick={handleClick}
        isLoading={isLoading}
        loadingText={loadingText}
      />
    </div>
  );
};

export default SettingsElement;
