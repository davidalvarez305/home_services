import React, { useContext } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useAccountRequired from "../../../hooks/useAccountRequired";
import { Formik } from "formik";
import { LeadQuote } from "../../../types/general";
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
  useAccountRequired();

  async function handleCreateQuote(values: {
    zip_code: string;
    photos: FileList | null;
    service: number;
    street_address_line_1: string;
    street_address_line_2: string;
    street_address_line_3: string;
    city: number;
    state: number;
    country: number;
  }) {
    return new Promise((resolve) => {
      const { photos, ...input } = values;

      makeRequest(
        {
          url: `${LEAD_ROUTE}/${ctx?.lead.id}/quote`,
          method: "POST",
          data: input,
        },
        (res) => {
          const allQuotes: LeadQuote[] = res.data.data;
          const lastQuote = allQuotes[allQuotes.length - 1];

          if (lastQuote.id && photos) {
            const fd = new FormData();

            for (let i = 0; i < photos.length; i++) {
              fd.append("images", photos[i], photos[i]?.name);
            }

            makeRequest(
              {
                url: `${LEAD_ROUTE}/${ctx?.lead.id}/quote/${lastQuote.id}/photo`,
                method: "POST",
                data: fd,
              },
              (_) => {} // TBD
            );
          }

          setLeadQuotes(allQuotes);
          setAddQuote(false);
          return resolve(true);
        }
      );
    });
  }

  return (
    <PrimaryLayout screenName="Add Quote">
      <Formik
        initialValues={{
          zip_code: "",
          photos: null,
          service: 0,
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
