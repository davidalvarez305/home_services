import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import useLoginRequired from "../../hooks/useLoginRequired";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import { COMPANY_ROUTE, SERVICE_ROUTE } from "../../constants";
import { CompanyLead, Service } from "../../types/general";
import LeadsTable from "../../components/LeadsTable";
import Button from "../../components/Button";
import { Form, Formik } from "formik";
import FormInput from "../../components/FormInput";
import Modal from "../../components/Modal";
import CustomSelect from "../../components/CustomSelect";
import DateRangePickerComponent from "../../components/DateRangePicker";

const THIRTY_DAYS_AGO = new Date(new Date().setDate(new Date().getDate() - 30));
const TODAY = new Date();

const CompanyLeads: React.FC = () => {
  const ctx = useContext(UserContext);
  useLoginRequired();
  const { makeRequest, isLoading, error } = useFetch();
  const [companyLeads, setCompanyLeads] = useState<CompanyLead[]>([]);
  const [querystring, setQuerystring] = useState(() => {
    return new URLSearchParams({
      offset: String(0),
      limit: String(8),
      start_date: String(THIRTY_DAYS_AGO.getTime()),
      end_date: String(TODAY.getTime()),
      service_id: String(null),
      zip_code: String(null),
    });
  });
  const [hasMore, setHasMore] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = useCallback(() => {
    makeRequest(
      {
        url: SERVICE_ROUTE,
      },
      (res) => {
        setServices(res.data.data);
      }
    );
  }, [makeRequest]);

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url:
            `${COMPANY_ROUTE}/${ctx?.user.company_id}/leads/?` +
            querystring.toString(),
        },
        (res) => {
          setHasMore(() => res.data.data.length === 8);
          setCompanyLeads((prev) => [...prev, ...res.data.data]);
        }
      );
    }

    fetchServices();
  }, [makeRequest, ctx?.user.company_id, querystring, fetchServices]);

  function handleLoadMore() {
    setQuerystring((prev) => {
      const current = {
        ...Object.fromEntries(prev),
        offset: String(
          parseInt(prev.get("offset")!) + parseInt(prev.get("limit")!)
        ),
      };
      return new URLSearchParams(current);
    });
  }

  function handleFetchFilters(values: {
    zip_code: string;
    service_id: string;
    start_date: string;
    end_date: string;
  }) {
    const zip_code =
      values.zip_code.length > 0 ? values.zip_code : String(null);
    const service_id =
      values.service_id.length > 0 ? values.service_id : String(null);

    const qs = new URLSearchParams({
      ...values,
      zip_code,
      service_id,
      offset: String(0),
      limit: String(8),
    });

    makeRequest(
      {
        url: `${COMPANY_ROUTE}/${ctx?.user.company_id}/leads/?` + qs.toString(),
      },
      (res) => {
        setCompanyLeads([...res.data.data]);

        setToggleModal(false);
      }
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-w-full justify-center items-center">
        <div className="my-2">
          <Button onClick={() => setToggleModal(true)}>Filters</Button>
        </div>
        <LeadsTable companyLeads={companyLeads} />
        {hasMore && (
          <div className="py-4">
            <Button disabled={isLoading} onClick={() => handleLoadMore()}>
              Load More
            </Button>
          </div>
        )}
      </div>
      {toggleModal && (
        <Modal
          isOpen={toggleModal}
          setIsOpen={setToggleModal}
          modalTitle={"Filters"}
        >
          <div className="w-full">
            <Formik
              initialValues={{
                zip_code: "",
                service_id: "",
                start_date: "",
                end_date: "",
              }}
              onSubmit={handleFetchFilters}
            >
              <Form>
                <div className="flex flex-col justify-center items-center gap-4">
                  <CustomSelect name={"service_id"} label={"Service"}>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.service}
                      </option>
                    ))}
                  </CustomSelect>
                  <div className="flex justify-center items-center mx-2 gap-4">
                    <DateRangePickerComponent
                      name={"start_date"}
                      label={"Start Date"}
                      defaultDate={THIRTY_DAYS_AGO}
                    />
                    <DateRangePickerComponent
                      name={"end_date"}
                      label={"End Date"}
                      defaultDate={TODAY}
                    />
                  </div>
                  <FormInput
                    className="w-full block border border-gray-200 rounded px-3 py-2 leading-5 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    name={"value"}
                    label={"Zip Code"}
                    placeholder={"Input..."}
                  />
                  <Button type={"submit"}>Fetch</Button>
                </div>
              </Form>
            </Formik>
          </div>
        </Modal>
      )}
    </Layout>
  );
};
export default CompanyLeads;
