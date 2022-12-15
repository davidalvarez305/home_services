import { Form, Formik } from "formik";
import React from "react";
import FormInput from "../../../components/FormInput";
import { useRouter } from "next/router";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import Button from "../../../components/Button";
import UserWrapper from "./UserWrapper";
import FormWrapper from "./FormWrapper";
import RequestErrorMessage from "../../../components/RequestErrorMessage";

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
    <UserWrapper>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <FormWrapper>
            <FormInput
              label="Username"
              name="username"
              placeholder="Username..."
            />
            <FormInput
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <FormInput
              label="Password"
              name="password"
              placeholder="Password..."
              type="password"
            />
            <Button
              type={"submit"}
              disabled={isLoading}
            >
              Sign up
            </Button>
          </FormWrapper>
          <RequestErrorMessage {...error} />
        </Form>
      </Formik>
    </UserWrapper>
  );
};

export default Register;
