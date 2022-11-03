import { Form, Formik } from "formik";
import React, { useState } from "react";
import Checkbox from "../../../components/Checkbox";
import SignInButton from "../../../components/SignInButton";
import PrimaryInput from "../../../components/PrimaryInput";
import Link from "next/link";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LoginOrRegister from "../UserWrapper";
import styles from "./ForgotPassword.module.css";

const ForgotPassword: React.FC = () => {
  const { makeRequest, isLoading, error } = useFetch();
  const [msg, setMsg] = useState("");

  function handleSubmit(values: { email: string }) {
    makeRequest(
      {
        url: USER_ROUTE + "/forgot-password",
        method: "POST",
        data: values,
      },
      (_) => {
        setMsg("Use the link sent to your inbox within the next 5 minutes.");
      }
    );
  }

  return (
    <LoginOrRegister
      h1Text="Forgot Password?"
      h1Subtext={
        msg.length === 0 ? (
          <p className={styles["enter-your-account"]}>
            Enter your email below, you will receive an email with instructions{" "}
            <br />
            on how to reset your password in a few minutes. You can also set a
            new <br />
            password if you’ve never set one before.
          </p>
        ) : (
          <div className={styles["recover-password-message"]}>{msg}</div>
        )
      }
      bottomTextOne="Don't have an account?"
      bottomLinkText="Register."
      bottomLinkDestination="register"
    >
      <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
        <Form>
          <div className={styles["form"]}>
            <PrimaryInput
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <div className={styles["flex-row"]}>
              <Checkbox>Remember me</Checkbox>
              <div className={styles["recover-password" + " x12px--bold"]}>
                <Link href={"/login"}>Login</Link>
              </div>
            </div>
            <SignInButton isLoading={isLoading}>Start Recovery</SignInButton>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </LoginOrRegister>
  );
};

export default ForgotPassword;
