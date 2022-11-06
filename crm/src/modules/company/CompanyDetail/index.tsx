import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import router from "next/router";
import { MdDelete } from "react-icons/md";
import { SettingsIcon } from "../../../assets/SettingsIcon";
import Image from "next/image";
import SettingsElement from "../../../components/SettingsElement";

const CompanyDetail: React.FC = () => {
  useLoginRequired();

  const settings = [
    {
      icon: <SettingsIcon />,
      primaryHeader: "Manage Users",
      subHeader: "Add, edit, or remove users from your company.",
      handleClick: () => {
        router.push("/company-users");
      },
      tagText: "Select",
    },
    {
      icon: <SettingsIcon />,
      primaryHeader: "Manage Company Settings",
      subHeader: "Change your address, or billing information.",
      handleClick: () => {
        router.push("/company-settings");
      },
      tagText: "Select",
    },
    {
      icon: <SettingsIcon />,
      primaryHeader: "Manage Services & Locations",
      subHeader:
        "Add, edit, or remove locations and their associated services.",
      handleClick: () => {
        router.push("/company-services");
      },
      tagText: "Select",
    },
  ];

  return (
    <PrimaryLayout screenName="Company Detail">
      <div className={"settings-container"}>
        {settings.map((setting) => (
          <div key={setting.primaryHeader}>
            <SettingsElement {...setting} />
          </div>
        ))}
      </div>
    </PrimaryLayout>
  );
};
export default CompanyDetail;
