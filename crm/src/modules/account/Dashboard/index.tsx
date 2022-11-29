import React, { useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLeadAuth from "../../../hooks/useLeadAuth";
import LargeBox from "../../../components/LargeBox";
import EmptyLargeBox from "../../../components/EmptyLargeBox";
import styles from "./Dashboard.module.css";
import { IconButton } from "@chakra-ui/react";
import { GoPlus } from "react-icons/go";
import { LeadQuote } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import AddQuote from "../AddQuote";

const Dashboard: React.FC = () => {
  const [leadQuotes, setLeadQuotes] = useState<LeadQuote[]>([]);
  const [addQuote, setAddQuote] = useState(false);
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();
  useLeadAuth();

  useEffect(() => {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/15/quote`,
      },
      (res) => {
        setLeadQuotes(res.data.data);
      }
    );
  }, [makeRequest]);

  function handleDeleteQuote(quoteId: number) {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/15/quote/${quoteId}`,
        method: "DELETE"
      },
      (res) => {
        setLeadQuotes(res.data.data);
      }
    );
  }

  if (addQuote) {
    return <AddQuote setAddQuote={setAddQuote} setLeadQuotes={setLeadQuotes} />;
  }

  return (
    <PrimaryLayout screenName="Dashboard">
      <div className={styles["main-container"]}>
        {leadQuotes.map((quote, index) => (
          <React.Fragment key={index}>
            <LargeBox
              bottomLeftHeader={quote.street_address_line_1}
              bottomLeftRegularParagraph={quote.city}
              bottomLeftBoldedParagraph={quote.state}
              bottomRightHeader={quote.services}
              topLeftHeader={"Budget Amount"}
              topLeftRegularParagraph={"$5000"}
              onDelete={() => handleDeleteQuote(quote.id)}
              onEdit={() => console.log('handle edit')}
            />
          </React.Fragment>
        ))}
        <EmptyLargeBox>
          <IconButton
            onClick={() => setAddQuote(true)}
            colorScheme={"blue"}
            variant={"ghost"}
            fontSize={"50px"}
            size={"lg"}
            aria-label="add"
            icon={<GoPlus />}
          />
        </EmptyLargeBox>
      </div>
      <RequestErrorMessage {...error} />
    </PrimaryLayout>
  );
};
export default Dashboard;
