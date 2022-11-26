import "../styles/globals.css";
import "../styles/styleguide.css";
import type { AppProps } from "next/app";
import UserProvider from "../context/UserContext";
import { ChakraProvider } from "@chakra-ui/react";
import LeadProvider from "../context/LeadContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <UserProvider>
        <LeadProvider>
          <Component {...pageProps} />
        </LeadProvider>
      </UserProvider>
    </ChakraProvider>
  );
}
