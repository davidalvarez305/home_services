import { Form, Formik, useFormikContext } from "formik";
import React, { useContext, useState } from "react";
import PrimaryInput from "../../components/FormInput";
import { useRouter } from "next/router";
import useFetch from "../../hooks/useFetch";
import { LEAD_ROUTE } from "../../constants";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import UserWrapper from "../user/auth/UserWrapper";
import { LeadContext } from "../../context/LeadContext";
import Button from "../../components/Button";
import { Lead } from "../../types/general";
import FormWrapper from "../user/auth/FormWrapper";
import { useToast } from "@chakra-ui/react";

const Login: React.FC = () => {
  const [enterCode, setEnterCode] = useState(false);
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(LeadContext);
  const toast = useToast();
  const { setFieldValue } = useFormikContext();
  const router = useRouter();
  const buttonClassName = "inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"

  function handleSubmit(values: { email: string }) {
    makeRequest(
      {
        url: LEAD_ROUTE + "/login",
        method: "POST",
        data: values,
      },
      (_) => {
        setEnterCode(true);
        setFieldValue('code', '');
        toast({
          title: "Success!",
          description: "Enter the code found in your inbox.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  }

  function handleSubmitCode(values: { code: string }) {
    makeRequest(
      {
        url: LEAD_ROUTE + "/login/" + values.code,
        method: "POST",
      },
      (res) => {
        const lead: Lead = res.data.data;
        ctx?.SetLead(lead);
        router.push("/account/" + lead.uuid);
      }
    );
  }

  if (enterCode) {
    return (
      <UserWrapper>
        <Formik initialValues={{ code: "" }} onSubmit={handleSubmitCode}>
          <Form>
            <FormWrapper>
              <PrimaryInput label="Code" name="code" placeholder="Code..." />
              <p
                style={{ cursor: "pointer" }}
                onClick={() => setEnterCode(false)}
              >
                Resend Code
              </p>
              <Button className={buttonClassName} type={"submit"} disabled={isLoading}>
                Send
              </Button>
            </FormWrapper>
            <RequestErrorMessage {...error} />
          </Form>
        </Formik>
      </UserWrapper>
    );
  }

  return (
    <UserWrapper>
      <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
        <Form>
          <FormWrapper>
            <PrimaryInput label="Enter Your Email" type={'email'} name="email" placeholder="Email..." />
            <Button className={buttonClassName} type={"submit"} disabled={isLoading}>
              Submit
            </Button>
          </FormWrapper>
          <RequestErrorMessage {...error} />
        </Form>
      </Formik>
    </UserWrapper>
  );
};

export default Login;
