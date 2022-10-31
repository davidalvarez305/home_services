import React, { useState } from "react";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import styles from "./Button.module.css";

type Props = ButtonProps & {
  className: "Dark" | "Light" | "Blue" | "LightBlue";
};

const Button: React.FC<Props> = ({ children, className, ...props }) => {
  const [isHovering, setIsHovering] = useState(false);
  const buttonOptions = {
    Dark: "button-dark",
    Light: "button-light",
    Blue: "button-blue",
    LightBlue: "button-light",
  };

  const labelOptions = {
    Dark: "label-dark",
    Light: "label-light",
    Blue: "label-dark",
    LightBlue: "label-light",
  };

  return (
    <ChakraButton
      sx={{
        cursor: isHovering ? "pointer" : undefined,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
      className={buttonOptions[className]}
    >
      <div className={labelOptions[className]}>{children}</div>
    </ChakraButton>
  );
};

export default Button;
