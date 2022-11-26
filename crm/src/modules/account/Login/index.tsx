import { Form, Formik } from "formik";
import React, { useContext } from "react";
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
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(LeadContext);
  const router = useRouter();

  function handleSubmit(values: { email: string; password: string }) {
    makeRequest(
      {
        url: LEAD_ROUTE + "login",
        method: "POST",
        data: values,
      },
      (res) => {
        ctx?.SetLead(res.data.data);
        router.push("/");
      }
    );
  }

  return (
    <LoginOrRegister
      h1Text="Sign In"
      h1Subtext="Enter your account details"
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className={styles["form"]}>
            <PrimaryInput
              label="Code"
              name="uuid"
              placeholder="Code..."
            />
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
