import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { LeadContext } from "../../../context/LeadContext";
import LeadForm from "../../../forms/LeadForm";
import useFetch from "../../../hooks/useFetch";
import useAccountRequired from "../../../hooks/useAccountRequired";
import { LEAD_ROUTE } from "../../../constants";
import Button from "../../../components/Button";
import Image from "next/image";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import DeleteButton from "../../../components/DeleteIconButton";
import CarouselModal from "../../../components/CarouselModal";
import AccountLayout from "../../../layout/Account";
import { Lead, LeadDetails } from "../../../types/general";
import AccountDetailsForm from "../../../forms/AccountDetailsForm";

interface Props {
  lead: LeadDetails;
  setLeadToEdit: React.Dispatch<React.SetStateAction<LeadDetails | undefined>>;
  type: "ACCOUNT" | "QUOTE";
}

const EditLead: React.FC<Props> = ({ lead, setLeadToEdit, type }) => {
  useAccountRequired();
  const ctx = useContext(LeadContext);
  const { makeRequest, isLoading, error } = useFetch();
  const [openCarousel, setOpenCarousel] = useState(false);
  const [leadPhotos, setLeadPhotos] = useState(() => {
    if (lead.photos) {
      return lead.photos.split(",");
    }
    return null;
  });

  async function handleSubmit(values: {
    id: number;
    zip_code: string;
    photos: FileList | null;
    service: number;
    street_address_line_1: string | null;
    street_address_line_2: string | null;
    street_address_line_3: string | null;
    budget: number;
  }) {
    return new Promise((resolve) => {
      const { photos, ...input } = values;

      makeRequest(
        {
          url: `${LEAD_ROUTE}/${ctx?.lead.id}`,
          method: "PUT",
          data: input,
        },
        (res) => {
          const lead: Lead = res.data.data;

          if (lead.id && photos) {
            const fd = new FormData();

            for (let i = 0; i < photos.length; i++) {
              fd.append("images", photos[i], photos[i]?.name);
            }

            makeRequest(
              {
                url: `${LEAD_ROUTE}/${ctx?.lead.id}/photo`,
                method: "POST",
                data: fd,
              },
              (_) => {
                setLeadToEdit(undefined);
                return resolve(true);
              } // TBD
            );
          } else {
            setLeadToEdit(undefined);
            return resolve(true);
          }
        }
      );
    });
  }

  function handleDeletePhoto(url: string) {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead.id}/photo/${url}`,
        method: "DELETE",
      },
      (res) => {
        setLeadPhotos(() => {
          return res.data.data.map(
            (photo: { image_url: string }) => photo.image_url
          );
        });
      }
    );
  }

  return (
    <AccountLayout screenName="Edit Lead">
      <Formik
        initialValues={{
          ...lead,
          service: lead.service_id,
          photos: null,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await handleSubmit(values);
          setSubmitting(false);
        }}
      >
        <div>
          {type === "QUOTE" ? (
            <LeadForm setToggleForm={() => setLeadToEdit(undefined)} />
          ) : (
            <AccountDetailsForm
              setToggleForm={() => setLeadToEdit(undefined)}
            />
          )}
          <RequestErrorMessage {...error} />
          {leadPhotos && (
            <Button
              className="Dark"
              onClick={() => setOpenCarousel((prev) => !prev)}
            >
              see images
            </Button>
          )}
        </div>
      </Formik>
      {openCarousel && leadPhotos && (
        <CarouselModal>
          {leadPhotos.map((photo) => (
            <div key={photo}>
              <div>
                <DeleteButton
                  aria-label={"delete photo"}
                  onClick={() => handleDeletePhoto(photo)}
                  isLoading={isLoading}
                />
              </div>
              <Image
                src={`https://home-services-app.s3.amazonaws.com/lead-photos/${photo}`}
                alt={photo}
                width={400}
                height={400}
              />
            </div>
          ))}
        </CarouselModal>
      )}
    </AccountLayout>
  );
};

export default EditLead;
