import { Form, Formik } from "formik";
import React from "react";
import Checkbox from "../../../components/Checkbox";
import SignInButton from "../../../components/SignInButton";
import PrimaryInput from "../../../components/PrimaryInput";
import Link from "next/link";
import useFetch from "../../../hooks/useFetch";
import { LOGIN_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LoginOrRegister from "../UserWrapper";

const ForgotPassword: React.FC = () => {
  const { makeRequest, isLoading, error } = useFetch();

  function handleSubmit(values: { email: string }) {
    makeRequest(
      {
        url: LOGIN_ROUTE,
        method: "POST",
        data: values,
      },
      (res) => {
        console.log(res.data.data);
      }
    );
  }

  return (
    <LoginOrRegister
      h1Text="Forgot Password?"
      h1Subtext={
        <p className="enter-your-account-d x14px--regular">
          Enter your email below, you will receive an email with instructions <br />
          on how to reset your password in a few minutes. You can also set a new <br />
          password if you’ve never set one before.
        </p>
      }
      bottomTextOne="Don't have an account?"
      bottomLinkText="Register."
      bottomLinkDestination="register"
    >
      <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
        <Form>
          <div className="form">
            <PrimaryInput
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <div className="flex-row">
              <Checkbox>Remember me</Checkbox>
              <div className="recover-password x12px--bold">
                <Link href={"/forgot-password"}>Forgot Password</Link>
              </div>
            </div>
            <SignInButton isLoading={isLoading}>Start Recovery</SignInButton>
            {error.message.length > 0 && <RequestErrorMessage {...error} />}
          </div>
        </Form>
      </Formik>
    </LoginOrRegister>
  );
};

export default ForgotPassword;
