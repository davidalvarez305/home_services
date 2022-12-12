import { Form, Formik } from "formik";
import { useState } from "react";
import Button from "../../../components/Button";
import PrimaryInput from "../../../components/FormInput";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { USER_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import PrimaryLayout from "../../../components/Layout";
import styles from "./ChangePassword.module.css";

const ChangePassword = () => {
  useLoginRequired();
  const [msg, setMsg] = useState("");
  const { isLoading, makeRequest, error } = useFetch();

  function handleSubmit(values: { email: string }) {
    if (values.email === "") {
      return;
    }

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

  if (msg.length > 0) {
    return (
      <PrimaryLayout>
        <div>{msg}</div>
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout>
      <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
        <Form>
          <div className={styles["form"]}>
            <PrimaryInput
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <Button className={"Dark"} type={"submit"} isLoading={isLoading}>
              Submit
            </Button>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </PrimaryLayout>
  );
};

export default ChangePassword;
