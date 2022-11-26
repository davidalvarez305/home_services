import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const Login: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Login">
      <div>Login</div>
    </PrimaryLayout>
  );
};
export default Login;
