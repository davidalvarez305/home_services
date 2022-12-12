import React from "react";
import PrimaryLayout from "../../../components/Layout";
import useLoginRequired from "../../../hooks/useLoginRequired";
import router from "next/router";
import { SettingsIcon } from "../../../assets/SettingsIcon";
import SettingsElement from "../../../components/SettingsElement";
import { CreditCardIcon } from "../../../assets/CreditCardIcon";

const CompanySettings: React.FC = () => {
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
      icon: <CreditCardIcon />,
      primaryHeader: "Manage Billing",
      subHeader: "Change your billing information, or handle your invoices.",
      handleClick: () => {
        router.push("/company-billing");
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
export default CompanySettings;
