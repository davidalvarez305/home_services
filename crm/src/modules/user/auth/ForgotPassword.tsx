import { Form, Formik } from "formik";
import React from "react";
import FormInput from "../../../components/FormInput";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import Button from "../../../components/Button";
import UserWrapper from "./UserWrapper";
import FormWrapper from "./FormWrapper";
import RequestErrorMessage from "../../../components/RequestErrorMessage";

export default function ForgotPassword() {
  const { makeRequest, isLoading, error } = useFetch();

  function handleSubmit(values: { email: string }) {
    makeRequest(
      {
        url: USER_ROUTE + "/forgot-password",
        method: "POST",
        data: values,
      },
      (_) => {}
    );
  }

  return (
    <UserWrapper>
      <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
        <Form>
          <FormWrapper>
            <FormInput
              label="Email"
              name="email"
              placeholder="Email..."
              type="email"
            />
            <Button
              className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
              type={"submit"}
              disabled={isLoading}
            >
              Start Recovery
            </Button>
          </FormWrapper>
          <RequestErrorMessage {...error} />
        </Form>
      </Formik>
    </UserWrapper>
  );
}
