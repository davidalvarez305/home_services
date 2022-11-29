import { Formik } from "formik";
import { useContext } from "react";
import { LeadContext } from "../../../context/LeadContext";
import QuoteForm from "../../../forms/QuoteForm";
import useFetch from "../../../hooks/useFetch";
import useLeadAuth from "../../../hooks/useLeadAuth";
import { LeadQuote } from "../../../types/general";

interface Props {
  quote: LeadQuote;
}

const EditQuote: React.FC<Props> = ({ quote }) => {
  useLeadAuth();
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();

  async function handleSubmit(quote: LeadQuote) {}

  return (
    <Formik
      initialValues={quote}
      onSubmit={async (values, { setSubmitting }) => {
        await handleSubmit(values);
        setSubmitting(false);
      }}
    >
      <QuoteForm setToggleForm={() => console.log(false)} />
    </Formik>
  );
};

export default EditQuote;
