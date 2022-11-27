import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLeadAuth from "../../../hooks/useLeadAuth";
import LargeBox from "../../../components/LargeBox";

const Dashboard: React.FC = () => {
  useLeadAuth();

  return (
    <PrimaryLayout screenName="Dashboard">
      <LargeBox
        bottomLeftHeader={""}
        bottomLeftRegularParagraph={"Hialeah"}
        bottomLeftBoldedParagraph={"FL"}
        bottomRightHeader={"Bathroom Remodeling"}
        topLeftHeader={"Budget Amount"}
        topLeftRegularParagraph={'$5000'}
      />
    </PrimaryLayout>
  );
};
export default Dashboard;
