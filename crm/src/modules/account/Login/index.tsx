import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import Checkbox from "../../../components/Checkbox";
import PrimaryInput from "../../../components/FormInput";
import { useRouter } from "next/router";
import Link from "next/link";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LoginOrRegister from "../../user/UserWrapper";
import { LeadContext } from "../../../context/LeadContext";
import styles from "./Login.module.css";
import Button from "../../../components/Button";

const Login: React.FC = () => {
  const [enterCode, setEnterCode] = useState(false);
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

  if (enterCode) {
    return (
      <LoginOrRegister h1Text="Sign In" h1Subtext="Enter your account details">
        <Formik initialValues={{ code: "" }} onSubmit={handleSubmitCode}>
          <Form>
            <div className={styles["form"]}>
              <PrimaryInput label="Code" name="code" placeholder="Code..." />
              <div className={styles["flex-row"]}>
                <div className={styles["recover-password"]}>
                  <p onClick={() => setEnterCode(false)}>Resend Code</p>
                </div>
              </div>
              <Button type={"submit"} className={"Blue"} isLoading={isLoading}>
                Sign in
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
                <Link href={"/forgot-password"}>Forgot Code</Link>
              </div>
            </div>
            <Button type={"submit"} className={"Blue"} isLoading={isLoading}>
              Sign in
            </Button>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </LoginOrRegister>
  );
};

export default Login;
