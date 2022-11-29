import React, { useContext } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLeadAuth from "../../../hooks/useLeadAuth";
import { Formik } from "formik";
import { CreateQuoteInput, LeadQuote } from "../../../types/general";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import QuoteForm from "../../../forms/QuoteForm";

interface Props {
  setAddQuote: React.Dispatch<React.SetStateAction<boolean>>;
  setLeadQuotes: React.Dispatch<React.SetStateAction<LeadQuote[]>>;
}

const AddQuote: React.FC<Props> = ({ setAddQuote, setLeadQuotes }) => {
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();
  useLeadAuth();

  async function handleCreateQuote(values: {
    zip_code: string;
    photos: FileList | null;
    services: number;
    street_address_line_1: string;
    street_address_line_2: string;
    street_address_line_3: string;
    city: number;
    state: number;
    country: number;
  }) {
    let formValues: CreateQuoteInput = {
      ...values,
      services: [values.services],
      city_id: values.city,
      state_id: values.state,
      country_id: values.country,
    };

    makeRequest(
      {
        url: `${LEAD_ROUTE}/15/quote`,
        method: "POST",
        data: formValues,
      },
      (res) => {
        const allQuotes: LeadQuote[] = res.data.data;
        const lastQuote = allQuotes[allQuotes.length - 1];

        if (lastQuote.id && values.photos) {
          const fd = new FormData();

          for (let i = 0; i < values.photos.length; i++) {
            fd.append("images", values.photos[i], values.photos[i]?.name);
          }

          makeRequest(
            {
              url: `${LEAD_ROUTE}/15/quote/${lastQuote.id}/photo`,
              method: "POST",
              data: fd,
            },
            (res) => {
              if (res.data.data) {
                setLeadQuotes(allQuotes);
                setAddQuote(false);
              }
            }
          );
        }
      }
    );
  }

  return (
    <PrimaryLayout screenName="Add Quote">
      <Formik
        initialValues={{
          zip_code: "",
          photos: null,
          services: 0,
          street_address_line_1: "",
          street_address_line_2: "",
          street_address_line_3: "",
          city: 0,
          state: 0,
          country: 0,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await handleCreateQuote(values);
          setSubmitting(false);
        }}
      >
        <QuoteForm setToggleForm={setAddQuote} />
      </Formik>
      <RequestErrorMessage {...error} />
    </PrimaryLayout>
  );
};
export default AddQuote;
