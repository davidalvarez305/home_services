import { useToast } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import Image from "next/image";
import { useContext, useState } from "react";
import GreyInfoIcon from "../../../assets/GreyInfoIcon";
import RightArrowIcon from "../../../assets/RightArrowIcon";
import SmallXIcon from "../../../assets/SmallXIcon";
import UserProfileIcon from "../../../assets/UserProfileIcon";
import Button from "../../../components/Button";
import CarouselModal from "../../../components/CarouselModal";
import CustomModal from "../../../components/CustomModal";
import DeleteButton from "../../../components/DeleteIconButton";
import FormInput from "../../../components/FormInput";
import LargeFormSection from "../../../components/LargeFormSection";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import useFetch from "../../../hooks/useFetch";
import { LeadDetails } from "../../../types/general";

interface Props {
  lead: LeadDetails;
}

export default function UploadPhotos() {
  const { makeRequest, isLoading, error } = useFetch();
  const [photos, setPhotos] = useState<FileList | null>(null);
  const ctx = useContext(LeadContext);
  const toast = useToast();
  const [openCarousel, setOpenCarousel] = useState(false);
  const [leadPhotos, setLeadPhotos] = useState(() => {
    if (ctx?.lead?.photos) {
      return ctx.lead.photos.split(",");
    }
    return null;
  });

  function handleSubmit() {
    if (!photos) {
      document.getElementById("image")?.click();
      return;
    }

    const fd = new FormData();

    for (let i = 0; i < photos.length; i++) {
      fd.append("images", photos[i], photos[i]?.name);
    }

    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead?.id}/photo`,
        method: "POST",
        data: fd,
      },
      (_) => {
        toast({
          title: "Success!",
          description: "Photos have been uploaded.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  }

  function handleDeletePhoto(url: string) {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead?.id}/photo/${url}`,
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
    <div className="md:flex md:space-x-5">
      <LargeFormSection
        icon={<UserProfileIcon />}
        iconHeader={"Upload Photos"}
        paragraphText={
          "Adding photos will help contractors figure out how/if they can help you."
        }
      />
      <div className="flex flex-col justify-center h-20 py-20 rounded shadow-sm bg-white overflow-hidden md:w-2/3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-4 sm:space-y-0 sm:space-x-2">
          <input
            style={{ display: "none" }}
            id="image"
            onChange={(e) => setPhotos(e.target.files)}
            type="file"
            accept="image/*"
            multiple
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-6 py-2 leading-6 rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
          >
            <RightArrowIcon />
            <span>
              {photos ? `Save (${photos.length}) Photo(s)` : "Upload"}
            </span>
          </Button>
          <Button
            onClick={() => setOpenCarousel(true)}
            disabled={isLoading}
            className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-6 py-2 leading-6 rounded border-gray-200 bg-gray-200 text-gray-700 hover:text-gray-700 hover:bg-gray-300 hover:border-gray-300 focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-gray-200 active:border-gray-200"
          >
            <GreyInfoIcon />
            <span>View Photos</span>
          </Button>
        </div>
        <div className="flex flex-col justify-center items-center py-2">
          {photos && (
            <button
              onClick={() => setPhotos(null)}
              className="font-semibold inline-flex w-20 px-2 py-2 leading-4 items-center space-x-1 text-xs rounded text-red-700 bg-red-200"
            >
              <SmallXIcon />
              <span>Cancel</span>
            </button>
          )}
        </div>
      {openCarousel && leadPhotos && (
        <CustomModal>
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
        </CustomModal>
      )}
        <RequestErrorMessage {...error} />
      </div>
    </div>
  );
}
