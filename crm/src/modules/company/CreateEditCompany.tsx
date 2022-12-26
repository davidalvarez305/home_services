import { useCallback, useContext, useEffect, useState } from "react";
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
import { useRouter } from "next/router";
import CompanyUsers from "./CompanyUsers";

export default function CreateEditCompany() {
  useLoginRequired();
  const [companyFields, setCompanyFields] = useState({
    name: "",
    logo: "",
    street_address_line_1: "",
    street_address_line_2: "",
    street_address_line_3: "",
    city: 0,
    state: 0,
    zip_code: "",
  });
  const [company, setCompany] = useState<Company>();
  const ctx = useContext(UserContext);
  const { isLoading, makeRequest, error } = useFetch();
  const router = useRouter();

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url: COMPANY_ROUTE + "/" + ctx?.user.company_id,
        },
        (res) => {
          const comp: Company = res.data.data;
          setCompany(comp);

          setCompanyFields({
            name: comp.name,
            logo: comp.logo,
            street_address_line_1: comp.address.street_address_line_1,
            street_address_line_2: comp.address.street_address_line_2,
            street_address_line_3: comp.address.street_address_line_3,
            city: comp.address.city_id,
            state: comp.address.state_id,
            zip_code: comp.address.zip_code,
          });
        }
      );
    }
  }, [makeRequest, ctx?.user.company_id]);

  const handleSubmit = useCallback(
    (values: CreateCompanyInput) => {
      if (
        values.name === "" ||
        values.street_address_line_1 == "" ||
        values.city === 0 ||
        values.state === 0 ||
        values.zip_code === ""
      ) {
        return;
      }

      const API_ROUTE = company
        ? COMPANY_ROUTE + "/" + company?.id
        : COMPANY_ROUTE;

      makeRequest(
        {
          url: API_ROUTE,
          method: company ? "PUT" : "POST",
          data: {
            ...values,
            id: company?.id || undefined,
          },
        },
        (res) => {
          const updatedCompany: Company = res.data.data;
          ctx?.SetUser({ ...ctx.user, company_id: updatedCompany.id });
        }
      );
    },
    [company, ctx, makeRequest]
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="md:flex md:space-x-5">
          <LargeFormSection
            icon={<UserProfileIcon />}
            iconHeader={"Company Settings"}
            paragraphText={
              "Use this form to either create a company, or adjust an existing company's settings."
            }
          />
          <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
            <div className="p-5 lg:p-6 grow w-full">
              <CompanyForm
                initialValues={companyFields}
                handleSubmit={handleSubmit}
              />
              <div className="my-2 gap-4">
                <Button type={"submit"} disabled={isLoading}>
                  Submit
                </Button>
              </div>
            </div>
            <RequestErrorMessage {...error} />
          </div>
        </div>
        <div className="md:flex md:space-x-5">
          <LargeFormSection
            icon={<UserProfileIcon />}
            iconHeader={"Edit Services"}
            paragraphText={"Update your locations and services."}
          />
          <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
            <div className="p-5 lg:p-6 grow w-full">
              <Button onClick={() => router.push("/company-services")}>Edit Services</Button>
            </div>
          </div>
        </div>
      <CompanyUsers />
      </div>
    </Layout>
  );
}
