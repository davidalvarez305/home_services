import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";
import styles from "./TagElement.module.css";

type Props = ButtonProps & {
  tag: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
};

const TagElement: React.FC<Props> = ({ tag, handleClick, ...props }) => {
  return (
    <div className={`element-tags-f5-f5-fa-on-light-2`}>
      <Button {...props} onClick={handleClick} className="tag-3 x12px--bold">
        {tag}
      </Button>
    </div>
  );
};

export default TagElement;
