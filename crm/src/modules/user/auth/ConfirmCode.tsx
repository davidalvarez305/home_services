import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { useContext } from "react";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import useFetch from "../../../hooks/useFetch";
import { LeadDetails } from "../../../types/general";
import FormWrapper from "./FormWrapper";
import UserWrapper from "./UserWrapper";

interface Props {
    setEnterCode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfirmCode({ setEnterCode }:Props) {
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(LeadContext);
  const router = useRouter();

  function handleSubmitCode(values: { code: string }) {
    makeRequest(
      {
        url: LEAD_ROUTE + "/login/" + values.code,
        method: "POST",
      },
      (res) => {
        const lead: LeadDetails = res.data.data;
        ctx?.SetLead(lead);
        router.push("/account/" + lead.uuid);
      }
    );
  }

  return (
    <UserWrapper>
      <Formik initialValues={{ code: "" }} onSubmit={handleSubmitCode}>
        <Form>
          <FormWrapper>
            <FormInput label="Code" name="code" placeholder="Code..." />
            <p
              style={{ cursor: "pointer" }}
              onClick={() => setEnterCode(false)}
            >
              Resend Code
            </p>
            <Button
              className={
                "inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
              }
              type={"submit"}
              disabled={isLoading}
            >
              Send
            </Button>
          </FormWrapper>
          <RequestErrorMessage {...error} />
        </Form>
      </Formik>
    </UserWrapper>
  );
}
