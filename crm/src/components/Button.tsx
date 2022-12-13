import React from "react";
import LoadingButton from "../assets/LoadingButton";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<Props> = ({ children, ...props }) => {
  // if isDisabled -> render loading button
  if (props.disabled) {
    return (
      <button {...props}>
        <LoadingButton />
        Loading...
      </button>
    );
  }

  return <button {...props}>{children}</button>;
};

export default Button;
