import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  const footerLinks = [
    {
      link: "privacy policy",
      path: "/privacy-policy",
    },
    {
      link: "license",
      path: "/license",
    },
    {
      link: "about",
      path: "/about",
    },
    {
      link: "help",
      path: "/help",
    },
  ];
  const CURRENT_YEAR = new Date().getFullYear();
  return (
    <div className={styles["footer-navigation"]}>
      <Image
        width={500}
        height={500}
        alt=""
        className={styles["line"]}
        src="https://anima-uploads.s3.amazonaws.com/projects/631ef96c30c5be89e49afb9c/releases/63206d2ef3e0a49cce9c0cb4/img/line@1x.svg"
      />
      <div className={styles["flex-row"]}>
        <div className={styles["links"]}>
          {footerLinks.map(({ link, path }) => (
            <Link key={path} href={path}>
              <div className={styles["links-item" + " x12px--bold"]}>{link}</div>
            </Link>
          ))}
          <p className={styles["footer-rights-text" + " x12px--medium"]}>
            {CURRENT_YEAR + " All Rights Reserved"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
