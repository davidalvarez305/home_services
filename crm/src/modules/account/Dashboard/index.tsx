import React, { useContext, useEffect, useState } from "react";
import AccountLayout from "../../../layout/Account";
import useAccountRequired from "../../../hooks/useAccountRequired";
import LargeBox from "../../../components/LargeBox";
import styles from "./Dashboard.module.css";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import EditLead from "../EditLead";
import { LeadDetails } from "../../../types/general";

const Dashboard: React.FC = () => {
  const [leadDetails, setLeadDetails] = useState<LeadDetails[]>([]);
  const [leadToEdit, setLeadToEdit] = useState<LeadDetails>();
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();
  useAccountRequired();

  useEffect(() => {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead.id}`,
      },
      (res) => {
        setLeadDetails(res.data.data);
      }
    );
  }, [makeRequest, ctx?.lead.id]);

  function handleDeleteLead() {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead.id}`,
        method: "DELETE"
      },
      (res) => {
        setLeadDetails(res.data.data);
      }
    );
  }

  if (leadToEdit) {
    return <EditLead lead={leadToEdit} setLeadToEdit={setLeadToEdit} />
  }

  return (
    <AccountLayout screenName="Dashboard">
      <div className={styles["main-container"]}>
        {leadDetails.map((lead, index) => (
          <React.Fragment key={index}>
            <LargeBox
              bottomLeftHeader={lead.street_address_line_1}
              bottomLeftRegularParagraph={lead.city}
              bottomLeftBoldedParagraph={lead.state}
              bottomRightHeader={lead.service}
              topLeftHeader={"Budget Amount"}
              topLeftRegularParagraph={`$${lead.budget}`}
              onDelete={() => handleDeleteLead()}
              onEdit={() => setLeadToEdit(lead)}
            />
          </React.Fragment>
        ))}
      </div>
      <RequestErrorMessage {...error} />
    </AccountLayout>
  );
};
export default Dashboard;
