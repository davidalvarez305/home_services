import { Formik } from "formik";
import { useContext } from "react";
import { LeadContext } from "../../../context/LeadContext";
import QuoteForm from "../../../forms/QuoteForm";
import useFetch from "../../../hooks/useFetch";
import useLeadAuth from "../../../hooks/useLeadAuth";
import PrimaryLayout from "../../../layout/Primary";
import { LeadQuote } from "../../../types/general";

interface Props {
  quote: LeadQuote;
  setQuoteToEdit: React.Dispatch<React.SetStateAction<LeadQuote | undefined>>;
}

const EditQuote: React.FC<Props> = ({ quote, setQuoteToEdit }) => {
  useLeadAuth();
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();

  async function handleSubmit(values: {
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
    console.log(values);
  }
  console.log(quote);

  return (
    <PrimaryLayout screenName="Edit Quote">
      <Formik
        initialValues={{
          ...quote,
          city: quote.city_id,
          state: quote.state_id,
          country: quote.country_id,
          service: quote.service_id,
          photos: null,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await handleSubmit(values);
          setSubmitting(false);
        }}
      >
        <QuoteForm setToggleForm={() => setQuoteToEdit(undefined)} />
      </Formik>
    </PrimaryLayout>
  );
};

export default EditQuote;
