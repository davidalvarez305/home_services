import React from "react";
import styles from "./UserWrapper.module.css";
import Link from "next/link";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
  h1Text: string;
  h1Subtext: string | React.ReactNode;
  bottomTextOne?: string;
  bottomLinkText?: string;
  bottomLinkDestination?: string;
}

const UserWrapper: React.FC<Props> = ({
  children,
  h1Text,
  h1Subtext,
  bottomLinkText,
  bottomTextOne,
  bottomLinkDestination,
}) => {
  return (
    <div className={"container-center-horizontal"}>
      <div className={styles["registration-sign-in"]}>
        <div className={styles["flex-col"]}>
          <h1 className={styles["registration-title-heading" + " heading--h1"]}>
            {h1Text}
          </h1>
          <p
            className={
              typeof h1Subtext === "string" ? styles["form-subtext"] : undefined
            }
          >
            {h1Subtext}
          </p>
          {children}
          {bottomLinkText && bottomTextOne && bottomLinkDestination && (
            <div className={styles["register-account"]}>
              <p className={styles["register-account-paragraph"]}>
                {bottomTextOne}
              </p>
              <div className={styles["create-an-account"]}>
                <Link href={"/" + bottomLinkDestination}>{bottomLinkText}</Link>
              </div>
            </div>
          )}
        </div>
        <div className={styles["right-side-container"]}>
          <div className={styles["cta"]}>
            <div className={styles["promo"]}>
              <div className={styles["sub-heading-text" + " heading--h4"]}>
                The latest financial insights and analysis to keep you up to
                date and ahead of the curve.
              </div>
              <div className={styles["slider"]}>
                <div className={styles["rectangle"]}></div>
                <div className={styles["oval"]}></div>
                <div className={styles["oval"]}></div>
              </div>
              <div className={styles["bottom-text-heading" + " heading--h6"]}>
                Waiapi Karaka
              </div>
              <div
                className={styles["bottom-text-paragraph" + " x14px--regular"]}
              >
                Financial Officer
              </div>
            </div>
          </div>
          <div className={styles["image-section"]}>
            <Image
              style={{ objectFit: "contain" }}
              fill={true}
              alt=""
              className={styles["image-rectangle"]}
              src="https://anima-uploads.s3.amazonaws.com/projects/631ef96c30c5be89e49afb9c/releases/631ef971190c8b852614ea0e/img/rectangle@2x.png"
            />
            <Image
              style={{ objectFit: "contain" }}
              fill={true}
              alt=""
              className={styles["widget"]}
              src="https://anima-uploads.s3.amazonaws.com/projects/631ef96c30c5be89e49afb9c/releases/631ef971190c8b852614ea0e/img/widget@2x.svg"
            />
            <Image
              style={{ objectFit: "contain" }}
              fill={true}
              alt=""
              className={styles["second-widget"]}
              src="https://anima-uploads.s3.amazonaws.com/projects/631ef96c30c5be89e49afb9c/releases/631ef971190c8b852614ea0e/img/widget-copy@2x.svg"
            />
            <Image
              style={{ objectFit: "contain" }}
              fill={true}
              alt=""
              className={styles["third-widget"]}
              src="https://anima-uploads.s3.amazonaws.com/projects/631ef96c30c5be89e49afb9c/releases/631ef971190c8b852614ea0e/img/widget-1@2x.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWrapper;
