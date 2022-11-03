import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useContext } from "react";
import Button from "../../../components/Button";
import PrimaryInput from "../../../components/PrimaryInput";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { USER_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import PrimaryLayout from "../../../layout/Primary";
import styles from "./ChangePassword.module.css";

const ChangePassword = () => {
  // useLoginRequired();
  const ctx = useContext(UserContext);
  const { isLoading, makeRequest, error } = useFetch();
  const router = useRouter();

  function handleSubmit(values: { newPassword: string }) {
    if (!ctx?.user.id) {
      return;
    }

    makeRequest(
      {
        url: USER_ROUTE,
        method: "PUT",
        data: values,
      },
      (res) => {
        if (res.statusText === "OK") {
          ctx?.Logout();
        }
      }
    );
  }

  return (
    <PrimaryLayout screenName={"Change Password"}>
      <Formik initialValues={{ newPassword: "" }} onSubmit={handleSubmit}>
        <Form>
          <div className={styles["main-container"]}>
            <PrimaryInput label={"New Password"} name={"newPassword"} />
            <Button isLoading={isLoading} className="Dark" type="submit">
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
