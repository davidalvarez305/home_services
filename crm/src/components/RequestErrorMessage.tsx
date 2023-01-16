import React from "react";
import RequestErrorX from "../assets/RequestErrorX";

interface Props {
  message: string;
}

const RequestErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <React.Fragment>
      {message && message.length > 0 && (
        <div className="p-4 md:p-5 rounded text-red-700 bg-red-100">
        <div className="flex items-center mb-2">
          <RequestErrorX />
          <h3 className="font-semibold text-black">Uh oh! Something&apos;s not right:</h3>
        </div>
        <p className="ml-8">
          {message}
        </p>
      </div>
      )}
    </React.Fragment>
  );
};

export default RequestErrorMessage;
