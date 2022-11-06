import React from "react";
import PrimaryLayout from "../../../layout/Primary";
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
