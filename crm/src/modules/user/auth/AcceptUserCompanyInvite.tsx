import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Button from "../../../components/Button";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { COMPANY_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import FormWrapper from "./FormWrapper";
import UserWrapper from "./UserWrapper";

export default function AcceptUserCompanyInvite() {
  const [companyName, setCompanyName] = useState("");
  useLoginRequired();
  const router = useRouter();
  const { isLoading, makeRequest, error } = useFetch();
  const ctx = useContext(UserContext);

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const company = qs.get("companyName");
    if (company) {
      setCompanyName(company);
    }
  }, []);

  function handleSubmit() {
    makeRequest(
      {
        url:
          COMPANY_ROUTE +
          `/${router.query.companyId}/user/invite/${router.query.code}`,
        method: "PUT",
      },
      (res) => {
        ctx?.SetUser(res.data.data);
        router.push("/");
      }
    );
  }

  return (
    <UserWrapper>
      <FormWrapper>
        <div>Do you accept this invitation to {companyName}?</div>
        <Button
          className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
          onClick={() => handleSubmit()}
          disabled={isLoading}
        >
          Accept
        </Button>
      </FormWrapper>
      <RequestErrorMessage {...error} />
    </UserWrapper>
  );
}
