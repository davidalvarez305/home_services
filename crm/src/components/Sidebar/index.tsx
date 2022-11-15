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
      icon: <BarsIcon />,
      link: "leads",
      label: "Leads",
    },
    {
      icon: <ReportsIcon />,
      link: "company",
      label: "Dashboard",
    },
    {
      icon: <ReportsIcon />,
      link: "calculator",
      label: "Calculator",
    },
    {
      icon: <ReportsIcon />,
      link: "company-settings",
      label: "Company Settings",
    },
  ];

  const balances = [
    {
      icon: <USDFlagIcon />,
      link: "100,050.75 USD",
      label: "100,050.75 USD",
    },
    {
      icon: <USDFlagIcon />,
      link: "2310.40 EUR",
      label: "100,050.75 USD",
    },
    {
      icon: <USDFlagIcon />,
      link: "9455.50 GBP",
      label: "100,050.75 USD",
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
        <div className={styles["navigation-text"]}>Navigation</div>
        {navLinks.map((link) => (
          <React.Fragment key={link.link}>
            <SidebarElement
              handleClick={() => router.push("/" + link.link)}
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
              handleClick={() => router.push("/" + balance.link)}
              {...balance}
            />
          </React.Fragment>
        ))}
        <SidebarElement
          handleClick={() => router.push("/create-company")}
          icon={<PlusIcon />}
          label={"Create A Company"}
          link={"create-company"}
        />
      </div>
      <SidebarElement
        handleClick={() => router.push("/profile-settings")}
        icon={<SettingsIcon />}
        link={"profile-settings"}
        label={"Profile Settings"}
      />
    </div>
  );
}

export default Sidebar;
