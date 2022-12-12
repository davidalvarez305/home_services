import { Form, Formik } from "formik";
import React, { ChangeEvent, useContext, useState } from "react";
import PrimaryLayout from "../../../components/Layout";
import styles from "./ProfilePicture.module.css";
import { FiSend } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import useFetch from "../../../hooks/useFetch";
import { USER_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import useLoginRequired from "../../../hooks/useLoginRequired";
import Button from "../../../components/Button";
import { useToast } from "@chakra-ui/react";

const ProfilePicture = () => {
  const toast = useToast();
  useLoginRequired();
  const [isHovering, setIsHovering] = useState(false);
  const [image, setImage] = useState<File>();
  const ctx = useContext(UserContext);
  const { isLoading, makeRequest, error } = useFetch();

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  }

  function handleSubmit() {
    if (image) {
      const fd = new FormData();

      fd.append("image", image, image?.name);

      makeRequest(
        {
          url: USER_ROUTE + "/change-picture",
          method: "PUT",
          data: fd,
        },
        (res) => {
          ctx?.SetUser(res.data.data);
        }
      );
    } else {
      toast({
        title: "Missing image!",
        description: "You haven't selected an image.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const inlineStyles = {
    buttonDarkLabel: {
      alignItems: "flex-start",
      backgroundColor: "#000000",
      borderRadius: "8px",
      display: "flex",
      height: "56px",
      justifyContent: "flex-end",
      minWidth: "125px",
      padding: "17px 43px",
    },
    label: {
      color: "rgba(255, 255, 255, 1)",
      fontWeight: 700,
      lineHeight: "21px",
      minHeight: "21px",
      minWidth: "38px",
    },
  };

  return (
    <PrimaryLayout screenName="Change Profile Picture">
      <div className={styles["form-container"]}>
        <Formik initialValues={{ image: "" }} onSubmit={handleSubmit}>
          <Form>
            <div className={styles["form-subcontainer"]}>
              <label
                htmlFor="image"
                style={{
                  ...inlineStyles.buttonDarkLabel,
                  ...inlineStyles.label,
                  cursor: isHovering ? "pointer" : undefined,
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                Set Image
              </label>
              <input
                style={{ display: "none" }}
                id="image"
                onChange={handleUpload}
                type="file"
                accept="image/*"
              />
              {image && (
                <Button
                  type={"submit"}
                  isLoading={isLoading}
                  loadingText={"Uploading"}
                  className={"LightBlue"}
                >
                  <div className={styles["upload-button"]}>
                    Upload
                    <FiSend />
                  </div>
                </Button>
              )}
              <RequestErrorMessage {...error} />
            </div>
          </Form>
        </Formik>
        {image && (
          <div className={styles["close-button"]}>
            {image.name}{" "}
            <div
              onClick={() => setImage(undefined)}
              style={{
                cursor: isHovering ? "pointer" : undefined,
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <GrClose size={25} color={"#FF0000"} />
            </div>
          </div>
        )}
      </div>
    </PrimaryLayout>
  );
};

export default ProfilePicture;
