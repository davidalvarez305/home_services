import { Form, Formik } from "formik";
import React from "react";
import Checkbox from "../../../components/Checkbox";
import SignInButton from "../../../components/SignInButton";
import PrimaryInput from "../../../components/FormInput";
import { useRouter } from "next/router";
import Link from "next/link";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LoginOrRegister from "../UserWrapper/UserWrapper";
import styles from "./Register.module.css";
import Button from "../../../components/Button";

const Register: React.FC = () => {
  const { makeRequest, isLoading, error } = useFetch();
  const router = useRouter();

  function handleSubmit(values: {
    username: string;
    email: string;
    password: string;
  }) {
    if (
      values.username === "" ||
      values.password === "" ||
      values.email === ""
    ) {
      return;
    }
    makeRequest(
      {
        url: USER_ROUTE + "/register",
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
          <div className={styles["form"]}>
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
            <div className={styles["flex-row"]}>
              <Checkbox>Remember me</Checkbox>
              <div className={styles["recover-password" + " x12px--bold"]}>
                <Link href={"/forgot-password"}>Forgot Password</Link>
              </div>
            </div>
            <Button type={"submit"} className={"Blue"} isLoading={isLoading}>
              Sign up
            </Button>
            <RequestErrorMessage {...error} />
          </div>
        </Form>
      </Formik>
    </LoginOrRegister>
  );
};

export default Register;
