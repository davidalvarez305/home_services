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

const CompanyLeads: React.FC = () => {
  const ctx = useContext(UserContext);
  useLoginRequired();
  const { makeRequest, isLoading, error } = useFetch();
  const [companyLeads, setCompanyLeads] = useState<CompanyLead[]>([]);
  const [offsetLimits, setOffsetLimits] = useState({
    offset: 0,
    limit: 8,
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
      const qs = new URLSearchParams({
        offset: String(offsetLimits.offset),
        limit: String(offsetLimits.limit),
      });

      makeRequest(
        { url: `${COMPANY_ROUTE}/${ctx?.user.company_id}/leads/?` + qs },
        (res) => {
          setHasMore(() => res.data.data.length === 8);
          setCompanyLeads((prev) => [...prev, ...res.data.data]);
        }
      );
    }

    fetchServices();
  }, [makeRequest, ctx?.user.company_id, offsetLimits, fetchServices]);

  function handleLoadMore() {
    setOffsetLimits((prev) => {
      return {
        offset: prev.offset + prev.limit,
        limit: 8,
      };
    });
  }

  return (
    <Layout>
      <div className="flex flex-col min-w-full justify-center items-center">
        <Button onClick={() => setToggleModal(true)}>Filters</Button>
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
              initialValues={{ value: "", service: "", start_date: "" }}
              onSubmit={(values) =>
                console.log(new URLSearchParams(values).toString())
              }
            >
              <Form>
                <div className="flex flex-col justify-center items-center gap-4">
                  <CustomSelect name={"service"} label={"Service"}>
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
                      defaultDate={
                        new Date(new Date().setDate(new Date().getDate() - 30))
                      }
                    />
                    <DateRangePickerComponent
                      name={"end_date"}
                      label={"End Date"}
                      defaultDate={new Date()}
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
