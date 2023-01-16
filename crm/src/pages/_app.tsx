import "../styles/globals.css";
import type { AppProps } from "next/app";
import UserProvider from "../context/UserContext";
import LeadProvider from "../context/LeadContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <UserProvider>
        <LeadProvider>
          <Component {...pageProps} />
        </LeadProvider>
      </UserProvider>
  );
}
