import React from "react";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

type Props = ButtonProps & {
  className: "Dark" | "Light" | "Blue" | "LightBlue";
};

const Button: React.FC<Props> = ({ children, className, ...props }) => {
  const buttonStyles = {
    "button-dark": {
      alignItems: "flex-start",
      backgroundColor: "black",
      border: "1px solid",
      borderRadius: "8px",
      display: "flex",
      height: "56px",
      minWidth: "124px",
      padding: "17px 43px",
    },
    "label-dark": {
      color: "white",
      fontWeight: "700",
      lineHeight: "21px",
      minHeight: "21px",
      minWidth: "38px",
      fontSize: "16px",
    },
    "button-light": {
      alignItems: "flex-start",
      border: "1px solid",
      borderColor: "var(--cfdbd5outline-onlight2)",
      backgroundColor: "white",
      borderRadius: "8px",
      display: "flex",
      height: "58px",
      marginTop: "-1px",
      minWidth: "126px",
      padding: "17px 43px",
    },
    "label-light": {
      color: "var(--x0052ffsoft)",
      fontWeight: "700",
      lineHeight: "21px",
      minHeight: "21px",
      minWidth: "38px",
      fontSize: "16px",
    },
    "button-blue": {
      alignItems: "flex-start",
      backgroundColor: "var(--x0052ffsoft)",
      border: "1px solid",
      borderColor: "var(--x0052ffsoft)",
      borderRadius: "8px",
      display: "flex",
      height: "56px",
      minWidth: "124px",
      padding: "17px 43px",
    },
  };

  const buttonOptions = {
    Dark: buttonStyles["button-dark"],
    Light: buttonStyles["button-light"],
    Blue: buttonStyles["button-blue"],
    LightBlue: buttonStyles["button-light"],
  };

  const labelOptions = {
    Dark: buttonStyles["label-dark"],
    Light: buttonStyles["label-light"],
    Blue: buttonStyles["label-dark"],
    LightBlue: buttonStyles["label-light"],
  };

  return (
    <ChakraButton
      style={{ ...buttonOptions[className] }}
      {...props}
    >
      <div style={{ ...labelOptions[className] }}>{children}</div>
    </ChakraButton>
  );
};

export default Button;
