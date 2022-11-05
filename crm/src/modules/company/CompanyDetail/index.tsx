import React, { useContext } from "react";
import styles from "./Settings.module.css";
import { SettingsIcon } from "../../../assets/SettingsIcon";
import PrimaryLayout from "../../../layout/Primary";
import { UserContext } from "../../../context/UserContext";
import { BUCKET_URL, USER_ROUTE } from "../../../constants";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";
import useFetch from "../../../hooks/useFetch";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { useToast } from "@chakra-ui/react";
import Image from "next/image";

const CompanyDetail: React.FC = () => {
  const router = useRouter();
  useLoginRequired();
  const ctx = useContext(UserContext);
  const { makeRequest, isLoading, error } = useFetch();
  const toast = useToast();
  const USER_IMAGE = `${BUCKET_URL}/profile-pictures/${ctx?.user.profile_picture}`;

  function handleDeleteProfile() {
    makeRequest(
      {
        url: USER_ROUTE,
        method: "DELETE",
      },
      (_) => {
        ctx?.Logout();
      }
    );
  }

  const settings = [
    {
      icon: <SettingsIcon />,
      primaryHeader: "Change Password",
      subHeader: "Securely",
      handleClick: () => {
        router.push("/change-password");
      },
      tagText: "Change",
    },
    {
      icon: <MdDelete size={22} />,
      primaryHeader: "Delete Account",
      subHeader: "This action is unrecoverable.",
      handleClick: handleDeleteProfile,
      tagText: "Delete",
      isLoading: isLoading,
      loadingText: "Submitting",
    },
    {
      icon: (
        <Image
          className={styles["image"]}
          src={USER_IMAGE}
          alt="Me"
          height={200}
          width={200}
        />
      ),
      primaryHeader: "Change Profile Picture",
      subHeader: "Get a new look",
      handleClick: () => {
        router.push("/profile-picture");
      },
      tagText: "Change",
    },
  ];

  return (
    <PrimaryLayout screenName="Profile Settings">
      <div className={styles["settings-container"]}>
        {settings.map((setting) => (
          <div key={setting.primaryHeader}>yo</div>
        ))}
      </div>
      {error.message &&
        error.message.length > 0 &&
        toast({
          title: "Error deleting account.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })}
    </PrimaryLayout>
  );
};
export default CompanyDetail;
