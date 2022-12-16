import React, { useContext, useEffect, useState } from "react";
import useAccountRequired from "../../../hooks/useAccountRequired";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import EditLead from "../EditLead";
import { LeadDetails } from "../../../types/general";
import Layout from "../../../components/Layout";
import UserAccountSettings from "../UserAccountSettings";
import RequestErrorMessage from "../../../components/RequestErrorMessage";

const Dashboard: React.FC = () => {
  const [type, setType] = useState<"QUOTE" | "ACCOUNT">();
  const [leadToEdit, setLeadToEdit] = useState<LeadDetails>();
  const [leadDetails, setLeadDetails] = useState<LeadDetails>();
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();
  useAccountRequired();

  function handleLogout() {
    ctx?.Logout();
  }

  useEffect(() => {
    if (ctx?.lead.id) {
      makeRequest(
        {
          url: `${LEAD_ROUTE}/${ctx?.lead.id}`,
        },
        (res) => {
          setLeadDetails(res.data.data);
        }
      );
    }
  }, [makeRequest, ctx?.lead]);

  function handleDeleteLead() {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead.id}`,
        method: "DELETE",
      },
      (_) => {
        handleLogout();
      }
    );
  }

  if (leadToEdit && type) {
    return (
      <EditLead
        type={type}
        lead={leadToEdit}
        setLeadToEdit={setLeadToEdit}
        setLeadDetails={setLeadDetails}
      />
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        
        {ctx?.lead.id && (
          <UserAccountSettings lead={ctx.lead} />
        )}

        {/* Billing Information */}
        <div className="md:flex md:space-x-5">
          {/* Billing Information Info */}
          <div className="md:flex-none md:w-1/3 text-center md:text-left">
            <h3 className="flex items-center justify-center md:justify-start space-x-2 font-semibold mb-1">
              <svg
                className="hi-solid hi-credit-card inline-block w-5 h-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Billing Information</span>
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              Your billing information is never shown to other users and only
              used for creating your invoices.
            </p>
          </div>
          {/* END Billing Information Info */}

          {/* Card: Billing Information */}
          <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
            {/* Card Body: Billing Information */}
            <div className="p-5 lg:p-6 grow w-full">
              <form className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="billing_company" className="font-medium">
                    Company Name (Optional)
                  </label>
                  <input
                    className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="text"
                    id="billing_company"
                  />
                </div>
                <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-3">
                  <div className="space-y-1 grow">
                    <label htmlFor="billing_firstname" className="font-medium">
                      Firstname
                    </label>
                    <input
                      className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="text"
                      id="billing_firstname"
                    />
                  </div>
                  <div className="space-y-1 grow">
                    <label htmlFor="billing_lastname" className="font-medium">
                      Lastname
                    </label>
                    <input
                      className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="text"
                      id="billing_lastname"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="billing_address1" className="font-medium">
                    Street Address 1
                  </label>
                  <input
                    className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="text"
                    id="billing_address1"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="billing_address2" className="font-medium">
                    Street Address 2
                  </label>
                  <input
                    className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="text"
                    id="billing_address2"
                  />
                </div>
                <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-3">
                  <div className="space-y-1 sm:w-2/3">
                    <label htmlFor="billing_city" className="font-medium">
                      City
                    </label>
                    <input
                      className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="text"
                      id="billing_city"
                    />
                  </div>
                  <div className="space-y-1 sm:w-1/3">
                    <label htmlFor="billing_postal" className="font-medium">
                      Postal
                    </label>
                    <input
                      className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      type="text"
                      id="billing_postal"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="billing_vat" className="font-medium">
                    VAT Number
                  </label>
                  <input
                    className="block border border-gray-200 rounded bg-gray-100 cursor-not-allowed px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="text"
                    id="billing_vat"
                    name="billing_vat"
                    disabled
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
                >
                  Save Changes
                </button>
              </form>
            </div>
            {/* END Card Body: Billing Information */}
          </div>
          {/* END Card: Billing Information */}
        </div>
        {/* END Billing Information */}
      </div>
      <RequestErrorMessage {...error} />
    </Layout>
  );
};
export default Dashboard;
