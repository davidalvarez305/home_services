import { Form, Formik } from "formik";
import React, { useContext } from "react";
import Checkbox from "../../../components/Checkbox";
import SignInButton from "../../../components/SignInButton";
import PrimaryInput from "../../../components/PrimaryInput";
import { useRouter } from "next/router";
import Link from "next/link";
import useFetch from "../../../hooks/useFetch";
import { LOGIN_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LoginOrRegister from "../UserWrapper";
import { UserContext } from "../../../context/UserContext";

const Login: React.FC = () => {
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(UserContext);
  const router = useRouter();

  function handleSubmit(values: { email: string; password: string }) {
    makeRequest(
      {
        url: LOGIN_ROUTE,
        method: "POST",
        data: values,
      },
      (res) => {
        ctx?.Login(res.data.data);
        router.push("/");
      }
    );
  }

  return (
    <LoginOrRegister
      h1Text="Sign In"
      h1Subtext="Enter your account details"
      bottomTextOne="Don't have an account?"
      bottomLinkText="Register."
      bottomLinkDestination="register"
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="form">
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
            <SignInButton isLoading={isLoading}>Sign in</SignInButton>
            {error.message.length > 0 && <RequestErrorMessage {...error} />}
          </div>
        </Form>
      </Formik>
    </LoginOrRegister>
  );
};

export default Login;
