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
import { Button } from "@chakra-ui/react";

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
    return <EditLead type={type} lead={leadToEdit} setLeadToEdit={setLeadToEdit} setLeadDetails={setLeadDetails} />;
  }

  return (
    <AccountLayout screenName="Dashboard">
      <div className={styles["main-container"]}>
        {leadDetails && (
          <div className={styles["box-container"]}>
            <div>
              <LargeBox
                bottomLeftHeader={leadDetails.street_address_line_1 || ""}
                bottomLeftRegularParagraph={leadDetails.city || ""}
                bottomLeftBoldedParagraph={leadDetails.state || ""}
                bottomRightHeader={leadDetails.service}
                topLeftHeader={"Budget Amount"}
                topLeftRegularParagraph={`$${leadDetails.budget}`}
                onEdit={() => {
                  setLeadToEdit(leadDetails);
                  setType('QUOTE');
                }}
              />
            </div>
            <div>
              <LargeBox
                bottomLeftHeader={leadDetails.first_name + " " + leadDetails.last_name}
                bottomLeftRegularParagraph={`(${leadDetails.photos?.split(",").length})` + " Photos"}
                bottomLeftBoldedParagraph={""}
                bottomRightHeader={leadDetails.email}
                topLeftHeader={"Phone Number"}
                topLeftRegularParagraph={`+1 ${leadDetails.phone_number}`}
                onEdit={() => {
                  setLeadToEdit(leadDetails);
                  setType('ACCOUNT');
                }}
              />
            </div>
          </div>
        )}
        <div className={styles["buttons"]}>
          <Button onClick={() => handleLogout()} variant={"outline"}>
            Logout
          </Button>
          <Button
            onClick={() => handleDeleteLead()}
            variant={"outline"}
            colorScheme={"red"}
          >
            Delete Account
          </Button>
        </div>
        <RequestErrorMessage {...error} />
      </div>
    </AccountLayout>
  );
};
export default Dashboard;
