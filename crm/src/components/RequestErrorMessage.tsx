import React from "react";

interface Props {
  message: string;
}

const RequestErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <React.Fragment>
      {message && message.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <p
            style={{
              color: "red",
              fontSize: 18,
            }}
          >
            {message}
          </p>
        </div>
      )}
    </React.Fragment>
  );
};

export default RequestErrorMessage;
