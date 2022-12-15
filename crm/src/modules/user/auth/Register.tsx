import { Form, Formik } from "formik";
import React from "react";
import PrimaryInput from "../../../components/FormInput";
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
            <PrimaryInput
              className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              label="Username"
              name="username"
              placeholder="Username..."
            />
            <PrimaryInput
              className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <PrimaryInput
              className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              label="Password"
              name="password"
              placeholder="Password..."
              type="password"
            />
            <Button
              className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
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
