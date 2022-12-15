import { Form, Formik } from "formik";
import React, { useContext } from "react";
import PrimaryInput from "../../../components/FormInput";
import { useRouter } from "next/router";
import useFetch from "../../../hooks/useFetch";
import { LOGIN_ROUTE } from "../../../constants";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { UserContext } from "../../../context/UserContext";
import Button from "../../../components/Button";
import UserWrapper from "./UserWrapper";
import FormWrapper from "./FormWrapper";

export default function Login() {
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
        ctx?.SetUser(res.data.data);
        router.push("/");
      }
    );
  }

  return (
    <UserWrapper>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        <Form>
          <FormWrapper>
            <PrimaryInput
              className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              label="Email"
            />
            <PrimaryInput
              className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              label="Password"
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
            >
              Sign In
            </Button>
          </FormWrapper>
          <RequestErrorMessage {...error} />
        </Form>
      </Formik>
    </UserWrapper>
  );
}
