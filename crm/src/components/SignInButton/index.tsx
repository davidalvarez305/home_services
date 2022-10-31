import { Button as ChakraButton } from "@chakra-ui/react";
import React from "react";
import styles from "./SignInButton.module.css";

type Props = {
  children: React.ReactNode;
  isLoading: boolean;
};

const SignInButton: React.FC<Props> = ({ children, isLoading }) => {
  return (
    <div className={styles["filled-button"]}>
      <ChakraButton
        isLoading={isLoading}
        loadingText="Submitting"
        type="submit"
        className={styles["overlap-group"]}
        sx={{
          alignItems: "flex-start",
          backgroundColor: "var(--x0052ffsoft3)",
          borderRadius: "8px",
          display: "flex",
          height: "54px",
          justifyContent: "flex-end",
          marginTop: "-1px",
          minWidth: "439px",
          padding: "16px 195px",
        }}
      >
        <div className={styles["label"] + " label--14px"}>{children}</div>
      </ChakraButton>
    </div>
  );
};

export default SignInButton;
