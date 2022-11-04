import useLoginRequired from "../hooks/useLoginRequired";
import PrimaryLayout from "../layout/Primary";

export default function Home() {
  useLoginRequired();
  return <PrimaryLayout screenName="Home">Hi!</PrimaryLayout>;
}
