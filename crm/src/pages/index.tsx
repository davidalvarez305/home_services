import useLoginRequired from "../hooks/useLoginRequired";
import PrimaryLayout from "../components/Layout";

export default function Home() {
  useLoginRequired();
  return <PrimaryLayout screenName="Home">Hi!</PrimaryLayout>;
}
