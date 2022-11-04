import React from "react";
import styles from "./Sidebar.module.css";
import { CreditCardIcon } from "../../assets/CreditCardIcon";
import { USDFlagIcon } from "../../assets/USDFlagIcon";
import SidebarElement from "../SidebarElement";
import { ReportsIcon } from "../../assets/ReportsIcon";
import { PlusIcon } from "../../assets/PlusIcon";
import { BarsIcon } from "../../assets/BarsIcon";
import { SettingsIcon } from "../../assets/SettingsIcon";
import { useRouter } from "next/router";
import Image from "next/image";

function Sidebar() {
  const router = useRouter();
  const navLinks = [
    {
      icon: <CreditCardIcon />,
      link: "Billing",
    },
    {
      icon: <BarsIcon />,
      link: "Leads",
    },
    {
      icon: <ReportsIcon />,
      link: "Company",
    },
  ];

  const balances = [
    {
      icon: <USDFlagIcon />,
      link: "100,050.75 USD",
    },
    {
      icon: <USDFlagIcon />,
      link: "2310.40 EUR",
    },
    {
      icon: <USDFlagIcon />,
      link: "9455.50 GBP",
    },
  ];

  return (
    <div className={styles["sidebar-navigation"]}>
      <Image
        width={500}
        height={500}
        alt=""
        className={styles["element-logo-hidden"]}
        src="https://anima-uploads.s3.amazonaws.com/projects/631ef96c30c5be89e49afb9c/releases/63206d2ef3e0a49cce9c0cb4/img/-element--logo---hidden@2x.svg"
      />
      <div className={styles["navigation"]}>
        <div className={styles["navigation-text"]}>
          Navigation
        </div>
        {navLinks.map((link) => (
          <React.Fragment key={link.link}>
            <SidebarElement
              handleClick={() => router.push(link.link)}
              {...link}
            />
          </React.Fragment>
        ))}
      </div>
      <div className={styles["balance"]}>
        <div className={styles["balances"]}>{"Traffic"}</div>
        {balances.map((balance) => (
          <React.Fragment key={balance.link}>
            <SidebarElement
              handleClick={() => router.push(balance.link)}
              {...balance}
            />
          </React.Fragment>
        ))}
        <SidebarElement
          handleClick={() => router.push("/budgets")}
          icon={<PlusIcon />}
          link={"Create A Budget"}
        />
      </div>
      <SidebarElement
        handleClick={() => router.push("/profile-settings")}
        icon={<SettingsIcon />}
        link={"Profile Settings"}
      />
    </div>
  );
}

export default Sidebar;
