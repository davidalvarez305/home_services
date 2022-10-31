import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";
import styles from "./TagElement.module.css";

type Props = ButtonProps & {
  tag: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
};

const TagElement: React.FC<Props> = ({ tag, handleClick, ...props }) => {
  return (
    <div className={styles["tag-element"]}>
      <Button
        {...props}
        onClick={handleClick}
        className={styles["tag" + " x12px--bold"]}
      >
        {tag}
      </Button>
    </div>
  );
};

export default TagElement;
