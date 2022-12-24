import { Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import { COMPANY_ROUTE } from "../../constants";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import useLoginRequired from "../../hooks/useLoginRequired";
import Layout from "../../components/Layout";
import { Company, CompanyLead, CreateCompanyInput } from "../../types/general";
import UserProfileIcon from "../../assets/UserProfileIcon";
import LargeFormSection from "../../components/LargeFormSection";
import CustomSelect from "../../components/CustomSelect";

export default function EditCompany() {
  useLoginRequired();
  const [company, setCompany] = useState<CompanyLead>();
  const ctx = useContext(UserContext);
  const { isLoading, makeRequest, error } = useFetch();

  const inputClassName =
    "block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

  useEffect(() => {
    makeRequest(
      {
        url: COMPANY_ROUTE + "/" + ctx?.user.company_id,
      },
      (res) => {
        setCompany(res.data.data);
      }
    );
  }, [makeRequest, ctx?.user.company_id]);

  function handleSubmit(values: CreateCompanyInput) {
    if (
      values.name === "" ||
      values.street_address_line_1 == "" ||
      values.city === 0 ||
      values.state === 0 ||
      values.zip_code === 0
    ) {
      return;
    }

    makeRequest(
      {
        url: COMPANY_ROUTE,
        method: "POST",
        data: {
          ...values,
          id: company?.id,
        },
      },
      (res) => {
        const company: Company = res.data.data;
        ctx?.SetUser({ ...ctx.user, company_id: company.id });
      }
    );
  }

  if (!company) {
    return (
      <Layout>
        <div>Company doesn&apos;t exist.</div>
      </Layout>
    );
  }

  if (company) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="md:flex md:space-x-5">
            <LargeFormSection
              icon={<UserProfileIcon />}
              iconHeader={"Edit Company"}
              paragraphText={
                "Use this form to edit your existing company settings."
              }
            />
            <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
              <div className="p-5 lg:p-6 grow w-full">
                <Formik initialValues={{ ...company }} onSubmit={handleSubmit}>
                  <Form>
                    <div className="space-y-6">
                      <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-3">
                        <div className="space-y-1 grow">
                          <FormInput
                            className={inputClassName}
                            label="Company Name"
                            name="name"
                            placeholder="Company, Inc"
                          />
                        </div>
                        <div className="space-y-1 grow">
                          <FormInput
                            className={inputClassName}
                            label="Company Logo"
                            name="logo"
                            placeholder="Logo URL"
                            type="url"
                          />
                        </div>
                        <div className="space-y-1 grow">
                          <FormInput
                            className={inputClassName}
                            label="Street Address Line 1"
                            name="street_address_line_1"
                            placeholder="Address Line 1..."
                          />
                        </div>
                        <div className="space-y-1 grow">
                          <FormInput
                            className={inputClassName}
                            label="Street Address Line 2"
                            name="street_address_line_2"
                            placeholder="Address Line 2..."
                          />
                        </div>
                        <div className="space-y-1 grow">
                          <FormInput
                            className={inputClassName}
                            label="Street Address Line 3"
                            name="street_address_line_3"
                            placeholder="Address Line 3..."
                          />
                        </div>
                      </div>
                      <div>
                        <CustomSelect name="zip_code" label={"Zip Code"}>
                          {[
                            { label: "", value: 0 },
                            { label: "33015", value: 1 },
                            { label: "33012", value: 2 },
                          ].map((option) => (
                            <option key={option.label} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </CustomSelect>
                        <CustomSelect name="city" label={"City"}>
                          {[
                            { label: "", value: 0 },
                            { label: "miami", value: 1 },
                            { label: "hialeah", value: 2 },
                          ].map((option) => (
                            <option key={option.label} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </CustomSelect>
                        <CustomSelect name="state" label={"State"}>
                          {[
                            { label: "", value: 0 },
                            { label: "florida", value: 1 },
                            { label: "georgia", value: 2 },
                          ].map((option) => (
                            <option key={option.label} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </CustomSelect>
                      </div>
                    </div>
                    <div className="my-2 gap-4">
                      <Button type={"submit"} disabled={isLoading}>
                        Submit
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </div>
              <RequestErrorMessage {...error} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
