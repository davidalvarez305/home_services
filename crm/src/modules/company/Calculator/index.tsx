import React from "react";
import PrimaryLayout from "../../../components/Layout";
import useLoginRequired from "../../../hooks/useLoginRequired";

const Calculator: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Calculator">
      <div>Calculator</div>
    </PrimaryLayout>
  );
};
export default Calculator;
