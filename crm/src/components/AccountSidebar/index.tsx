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
      icon: <SettingsIcon />,
      link: "/profile-settings",
      label: "Profile Settings"
    },
    {
      icon: <SettingsIcon />,
      link: "/quote-settings",
      label: "Location & Service"
    },
    {
      icon: <SettingsIcon />,
      link: "http://127.0.0.1:8000/",
      label: "Create New"
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
              handleClick={() => router.push(link.link)}
              {...link}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default AccountSidebar;
