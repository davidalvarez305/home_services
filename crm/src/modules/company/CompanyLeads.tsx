import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import useLoginRequired from "../../hooks/useLoginRequired";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import { COMPANY_ROUTE } from "../../constants";
import { CompanyLead } from "../../types/general";
import LeadsTable from "../../components/LeadsTable";
import Button from "../../components/Button";
import { Form, Formik } from "formik";
import FormInput from "../../components/FormInput";
import Modal from "../../components/Modal";
import CustomSelect from "../../components/CustomSelect";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
  const [startDate, setStartDate] = useState(new Date());

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
  }, [makeRequest, ctx?.user.company_id, offsetLimits]);

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
          <div className="w-full grid grid-cols-2 gap-1">
            <Formik
              initialValues={{ value: "", service: "" }}
              onSubmit={(values) => console.log(new URLSearchParams(values).toString())}
            >
              <Form>
                <CustomSelect name={"service"} label={"Service"}>
                  <option>Home Remodeling</option>
                </CustomSelect>
                <DayPicker
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    console.log(date?.getTime());
                    setStartDate(date!)
                  }}
                />
                <FormInput
                  className="w-full block border border-gray-200 rounded px-3 py-2 leading-5 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  name={"value"}
                  label={"Zip Code"}
                  placeholder={"Input..."}
                />
                <Button type={"submit"}>Fetch</Button>
              </Form>
            </Formik>
          </div>
        </Modal>
      )}
    </Layout>
  );
};
export default CompanyLeads;
