import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import Checkbox from "../../../components/Checkbox";
import PrimaryInput from "../../../components/FormInput";
import { useRouter } from "next/router";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LoginOrRegister from "../../user/UserWrapper";
import { LeadContext } from "../../../context/LeadContext";
import styles from "./Login.module.css";
import Button from "../../../components/Button";

const Login: React.FC = () => {
  const [enterCode, setEnterCode] = useState(false);
  const [forgotCode, setForgotCode] = useState(false);
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(LeadContext);
  const router = useRouter();

  function handleSubmit(values: { uuid: string }) {
    makeRequest(
      {
        url: LEAD_ROUTE + "/login",
        method: "POST",
        data: values,
      },
      (_) => {
        setForgotCode(false);
        setEnterCode(true);
      }
    );
  }

  function handleSubmitCode(values: { code: string }) {
    makeRequest(
      {
        url: LEAD_ROUTE + "/login/" + values.code,
        method: "POST",
      },
      (res) => {
        ctx?.SetLead(res.data.data);
        router.push("/");
      }
    );
  }

  function handleRecoverCode(values: { email: string }) {
    makeRequest(
      {
        url: LEAD_ROUTE + "/login/code",
        method: "POST",
        data: values
      },
      (_) => {
        setForgotCode(false);
        setEnterCode(false);
      }
    );
  }

  let cursorStyles = { cursor: 'pointer' }

  if (forgotCode) {
    return (
      <LoginOrRegister h1Text="Recover account code" h1Subtext="Enter your e-mail to get your code.">
        <Formik initialValues={{ email: "" }} onSubmit={handleRecoverCode}>
          <Form>
            <div className={styles["form"]}>
              <PrimaryInput label="Email" name="email" placeholder="Enter your email..." />
              <Button type={"submit"} className={"Blue"} isLoading={isLoading}>
                Send
              </Button>
              <RequestErrorMessage {...error} />
            </div>
          </Form>
        </Formik>
      </LoginOrRegister>
    );
  }

  if (enterCode) {
    return (
      <LoginOrRegister h1Text="Sign In" h1Subtext="Enter your account details">
        <Formik initialValues={{ code: "" }} onSubmit={handleSubmitCode}>
          <Form>
            <div className={styles["form"]}>
              <PrimaryInput label="Code" name="code" placeholder="Code..." />
              <div className={styles["flex-row"]}>
                <div className={styles["recover-password"]}>
                  <p style={cursorStyles} onClick={() => setEnterCode(false)}>Resend Code</p>
                </div>
              </div>
              <Button type={"submit"} className={"Blue"} isLoading={isLoading}>
                Send
              </Button>
              <RequestErrorMessage {...error} />
            </div>
          </Form>
        </Formik>
      </LoginOrRegister>
    );
  }

  return (
    <LoginOrRegister h1Text="Sign In" h1Subtext="Enter your account details">
      <Formik initialValues={{ uuid: "" }} onSubmit={handleSubmit}>
        <Form>
          <div className={styles["form"]}>
            <PrimaryInput label="Code" name="uuid" placeholder="Code..." />
            <div className={styles["flex-row"]}>
              <Checkbox>Remember me</Checkbox>
              <div className={styles["recover-password"]}>
                <p style={cursorStyles} onClick={() => setForgotCode(true)}>Forgot Code</p>
              </div>
            </div>
            <Button type={"submit"} className={"Blue"} isLoading={isLoading}>
              Submit
            </Button>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </LoginOrRegister>
  );
};

export default Login;
