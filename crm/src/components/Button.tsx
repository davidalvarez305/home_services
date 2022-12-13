import React from "react";
import LoadingButton from "../assets/LoadingButton";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<Props> = ({ children, ...props }) => {
  const defaultPrimaryButton = "inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
  // if isDisabled -> render loading button
  if (props.disabled) {
    return (
      <button {...props}>
        <LoadingButton />
        Loading...
      </button>
    );
  }

  return <button className={props.className ? props.className : defaultPrimaryButton} {...props}>{children}</button>;
};

export default Button;
