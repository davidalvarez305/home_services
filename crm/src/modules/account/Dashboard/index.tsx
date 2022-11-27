import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLeadAuth from "../../../hooks/useLeadAuth";
import LargeBox from "../../../components/LargeBox";
import EmptyLargeBox from "../../../components/EmptyLargeBox";
import styles from "./Dashboard.module.css";
import { IconButton } from "@chakra-ui/react";
import { GoPlus } from "react-icons/go";
const Dashboard: React.FC = () => {
  useLeadAuth();

  return (
    <PrimaryLayout screenName="Dashboard">
      <div className={styles["main-container"]}>
        <LargeBox
          bottomLeftHeader={""}
          bottomLeftRegularParagraph={"Hialeah"}
          bottomLeftBoldedParagraph={"FL"}
          bottomRightHeader={"Bathroom Remodeling"}
          topLeftHeader={"Budget Amount"}
          topLeftRegularParagraph={"$5000"}
        />
        <EmptyLargeBox>
          <IconButton
            colorScheme={"blue"}
            variant={"ghost"}
            fontSize={"50px"}
            size={"lg"}
            aria-label="add"
            icon={<GoPlus />}
          />
        </EmptyLargeBox>
      </div>
    </PrimaryLayout>
  );
};
export default Dashboard;
