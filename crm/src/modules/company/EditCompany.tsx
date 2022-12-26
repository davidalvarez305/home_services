import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import { COMPANY_ROUTE } from "../../constants";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import useLoginRequired from "../../hooks/useLoginRequired";
import Layout from "../../components/Layout";
import { Company, CreateCompanyInput } from "../../types/general";
import UserProfileIcon from "../../assets/UserProfileIcon";
import LargeFormSection from "../../components/LargeFormSection";
import CompanyForm from "./CompanyForm";

export default function EditCompany() {
  useLoginRequired();
  const [company, setCompany] = useState<Company>();
  const ctx = useContext(UserContext);
  const { isLoading, makeRequest, error } = useFetch();

    "block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url: COMPANY_ROUTE + "/" + ctx?.user.company_id,
        },
        (res) => {
          setCompany(res.data.data);
        }
      );
    }
  }, [makeRequest, ctx?.user.company_id]);

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
        url: COMPANY_ROUTE + "/" + company?.id,
        method: "PUT",
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
                <Formik
                  initialValues={{
                    id: company.id,
                    name: company.name,
                    logo: company.logo,
                    street_address_line_1:
                      company.address.street_address_line_1,
                    street_address_line_2:
                      company.address.street_address_line_2,
                    street_address_line_3:
                      company.address.street_address_line_3,
                    city: company.address.city_id,
                    state: company.address.state_id,
                    zip_code: company.address.zip_code,
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
}
