import { Form, Formik } from "formik";
import React from "react";
import Checkbox from "../../../components/Checkbox";
import SignInButton from "../../../components/SignInButton";
import PrimaryInput from "../../../components/PrimaryInput";
import { useRouter } from "next/router";
import Link from "next/link";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LoginOrRegister from "../UserWrapper";

const Register: React.FC = () => {
  const { makeRequest, isLoading, error } = useFetch();
  const router = useRouter();

  function handleSubmit(values: {
    username: string;
    email: string;
    password: string;
  }) {
    makeRequest(
      {
        url: USER_ROUTE,
        method: "POST",
        data: values,
      },
      (_) => {
        router.push("/login");
      }
    );
  }

  return (
    <LoginOrRegister
      h1Text="Sign Up"
      h1Subtext="Create your account by entering your details."
      bottomTextOne="Already have an account?"
      bottomLinkText="Login."
      bottomLinkDestination="login"
    >
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="form">
            <PrimaryInput
              label="Username"
              name="username"
              placeholder="Username..."
            />
            <PrimaryInput
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <PrimaryInput
              label="Password"
              name="password"
              placeholder="Password..."
              type="password"
            />
            <div className="flex-row">
              <Checkbox>Remember me</Checkbox>
              <div className="recover-password x12px--bold">
                <Link href={"/forgot-password"}>Forgot Password</Link>
              </div>
            </div>
            <SignInButton isLoading={isLoading}>Sign up</SignInButton>
            {error.message.length > 0 && <RequestErrorMessage {...error} />}
          </div>
        </Form>
      </Formik>
    </LoginOrRegister>
  );
};

export default Register;
