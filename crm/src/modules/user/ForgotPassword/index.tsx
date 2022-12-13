import { Form, Formik } from "formik";
import React, { useState } from "react";
import Checkbox from "../../../components/Checkbox";
import SignInButton from "../../../components/SignInButton";
import PrimaryInput from "../../../components/FormInput";
import Link from "next/link";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LoginOrRegister from "../UserWrapper";
import styles from "./ForgotPassword.module.css";
import Button from "../../../components/Button";

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
            Enter your email below, you will receive an email with a code.{" "}
            <br />
            Make sure to use the link to change your password within 5 minutes.
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
              <div className={styles["recover-password"]}>
                <Link href={"/login"}>Login</Link>
              </div>
            </div>
            <Button className={"Blue"} isLoading={isLoading}>
              Start Recovery
            </Button>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </LoginOrRegister>
  );
};

export default ForgotPassword;
