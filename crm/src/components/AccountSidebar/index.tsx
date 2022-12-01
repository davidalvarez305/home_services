import React from "react";
import styles from "./AccountSidebar.module.css";
import SidebarElement from "../SidebarElement";
import { ReportsIcon } from "../../assets/ReportsIcon";
import { PlusIcon } from "../../assets/PlusIcon";
import { BarsIcon } from "../../assets/BarsIcon";
import { SettingsIcon } from "../../assets/SettingsIcon";
import { useRouter } from "next/router";
import Image from "next/image";

function AccountSidebar() {
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

export default AccountSidebar;
