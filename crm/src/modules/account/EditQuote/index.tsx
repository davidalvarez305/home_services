import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { LeadContext } from "../../../context/LeadContext";
import QuoteForm from "../../../forms/QuoteForm";
import useFetch from "../../../hooks/useFetch";
import useAccountRequired from "../../../hooks/useAccountRequired";
import PrimaryLayout from "../../../layout/Primary";
import { LeadQuote, Quote } from "../../../types/general";
import { LEAD_ROUTE } from "../../../constants";
import Button from "../../../components/Button";
import Image from "next/image";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import DeleteButton from "../../../components/DeleteIconButton";
import CarouselModal from "../../../components/CarouselModal";

interface Props {
  quote: LeadQuote;
  setQuoteToEdit: React.Dispatch<React.SetStateAction<LeadQuote | undefined>>;
}

const EditQuote: React.FC<Props> = ({ quote, setQuoteToEdit }) => {
  useAccountRequired();
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();
  const [openCarousel, setOpenCarousel] = useState(false);
  const [quotePhotos, setQuotePhotos] = useState(() => quote.photos.split(","));

  async function handleSubmit(values: {
    id: number;
    zip_code: string;
    photos: FileList | null;
    service: number;
    street_address_line_1: string;
    street_address_line_2: string;
    street_address_line_3: string;
    city: number;
    state: number;
    country: number;
    budget: number;
  }) {
    return new Promise((resolve) => {
      const { photos, ...input } = values;

      makeRequest(
        {
          url: `${LEAD_ROUTE}/${ctx?.lead.id}/quote/${values.id}`,
          method: "PUT",
          data: input,
        },
        (res) => {
          const quote: Quote = res.data.data;

          if (quote.id && photos) {
            const fd = new FormData();

            for (let i = 0; i < photos.length; i++) {
              fd.append("images", photos[i], photos[i]?.name);
            }

            makeRequest(
              {
                url: `${LEAD_ROUTE}/${ctx?.lead.id}/quote/${quote.id}/photo`,
                method: "POST",
                data: fd,
              },
              (_) => {} // TBD
            );
          }
        }
      );
      setQuoteToEdit(undefined);
      return resolve(true);
    });
  }

  function handleDeletePhoto(url: string) {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead.id}/quote/${quote.id}/photo/${url}`,
        method: "DELETE",
      },
      (res) => {
        setQuotePhotos(() => {
          return res.data.data.map(
            (photo: { image_url: string }) => photo.image_url
          );
        });
      }
    );
  }

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
        <div>
          <QuoteForm setToggleForm={() => setQuoteToEdit(undefined)} />
          <RequestErrorMessage {...error} />
          <Button
            className="Dark"
            onClick={() => setOpenCarousel((prev) => !prev)}
          >
            see images
          </Button>
        </div>
      </Formik>
      {openCarousel && (
        <CarouselModal>
          {quotePhotos.map((photo, index) => (
            <div key={photo}>
              <div>
                <DeleteButton
                  aria-label={"delete photo"}
                  onClick={() => handleDeletePhoto(photo)}
                  isLoading={isLoading}
                />
              </div>
              <Image
                src={`https://home-services-app.s3.amazonaws.com/profile-pictures/${photo}`}
                alt={photo}
                width={400}
                height={400}
              />
            </div>
          ))}
        </CarouselModal>
      )}
    </PrimaryLayout>
  );
};

export default EditQuote;
