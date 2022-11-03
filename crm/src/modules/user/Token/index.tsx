import { Checkbox } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Button from "../../../components/Button";
import PrimaryInput from "../../../components/PrimaryInput";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import SignInButton from "../../../components/SignInButton";
import { USER_ROUTE } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import styles from "./Token.module.css";
import UserWrapper from "../UserWrapper/index";

const Token = () => {
  const { isLoading, makeRequest, error } = useFetch();
  const router = useRouter();

  function handleSubmit(values: { newPassword: string }) {
    console.log(router.query.code);
    makeRequest(
      {
        url: USER_ROUTE + "/change-password/" + router.query.code,
        method: "PUT",
        data: values,
      },
      (res) => {
        if (res.statusText === "OK") {
          router.push("/login");
        }
      }
    );
  }

  return (
    <UserWrapper
      h1Text="Change your password."
      h1Subtext={
        <p className={styles["enter-your-account"]}>Enter your new password.</p>
      }
      bottomTextOne="Don't have an account?"
      bottomLinkText="Register."
      bottomLinkDestination="register"
    >
      <Formik initialValues={{ newPassword: "" }} onSubmit={handleSubmit}>
        <Form>
          <div className={styles["form"]}>
            <PrimaryInput
              label={"New Password"}
              name={"newPassword"}
              type={"password"}
            />
            <SignInButton isLoading={isLoading}>Submit</SignInButton>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </UserWrapper>
  );
};

export default Token;
