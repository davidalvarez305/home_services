import React, { useContext } from "react";
import styles from "./AccountSidebar.module.css";
import SidebarElement from "../SidebarElement";
import { SettingsIcon } from "../../assets/SettingsIcon";
import { useRouter } from "next/router";
import Image from "next/image";
import { DJANGO_DOMAIN } from "../../constants";
import { LeadContext } from "../../context/LeadContext";

function AccountSidebar() {
  const router = useRouter();
  const ctx = useContext(LeadContext);

  const qs = new URLSearchParams({
    source: "crm referral"
  })

  const navLinks = [
    {
      icon: <SettingsIcon />,
      link: "/account/" + ctx?.lead.uuid,
      label: "Profile Settings"
    },
    {
      icon: <SettingsIcon />,
      link: DJANGO_DOMAIN + "?" + qs.toString(),
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
