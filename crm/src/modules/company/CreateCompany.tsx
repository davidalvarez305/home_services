import { Form, Formik } from "formik";
import { useContext } from "react";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import { COMPANY_ROUTE } from "../../constants";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import useLoginRequired from "../../hooks/useLoginRequired";
import Layout from "../../components/Layout";
import { Company, CreateCompanyInput } from "../../types/general";
import UserProfileIcon from "../../assets/UserProfileIcon";
import LargeFormSection from "../../components/LargeFormSection";
import CustomSelect from "../../components/CustomSelect";
import CompanyForm from "./CompanyForm";

export default function CreateCompany() {
  useLoginRequired();
  const ctx = useContext(UserContext);
  const { isLoading, makeRequest, error } = useFetch();

  function handleSubmit(values: CreateCompanyInput) {
    if (
      values.name === "" ||
      values.street_address_line_1 == "" ||
      values.city === 0 ||
      values.state === 0 ||
      values.zip_code === ""
    ) {
      return;
    }

    makeRequest(
      {
        url: COMPANY_ROUTE,
        method: "POST",
        data: values,
      },
      (res) => {
        const company: Company = res.data.data;
        ctx?.SetUser({ ...ctx.user, company_id: company.id });
      }
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="md:flex md:space-x-5">
          <LargeFormSection
            icon={<UserProfileIcon />}
            iconHeader={"Create Company"}
            paragraphText={"Use this form to submit a company for approval."}
          />
          <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
            <div className="p-5 lg:p-6 grow w-full">
              <Formik
                initialValues={{
                  name: "",
                  logo: "",
                  street_address_line_1: "",
                  street_address_line_2: "",
                  street_address_line_3: "",
                  city: 0,
                  state: 0,
                  zip_code: "",
                }}
                onSubmit={handleSubmit}
              >
                <CompanyForm />
                <div className="my-2 gap-4">
                  <Button type={"submit"} disabled={isLoading}>
                    Submit
                  </Button>
                </div>
              </Formik>
            </div>
            <RequestErrorMessage {...error} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
