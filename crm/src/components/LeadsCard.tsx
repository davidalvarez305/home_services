import NegativeDeltaArrow from "../assets/NegativeDeltaArrow";
import PositiveDeltaArrow from "../assets/PositiveDeltaArrow";

interface DeltaProps {
  isPositive: boolean;
  number: number;
}

function Delta({ number, isPositive }: DeltaProps) {
  const DELTA_COLOR = isPositive ? "text-emerald-700 bg-emerald-200" : "text-rose-700 bg-rose-200";
  return (
    <div
      className={`font-semibold inline-flex px-2 py-1 leading-4 items-center space-x-1 text-sm rounded-full ${DELTA_COLOR}`}
    >
      {isPositive ? <PositiveDeltaArrow /> : <NegativeDeltaArrow />}
      <span>{number}%</span>
    </div>
  );
}

interface Props {
  leads: number;
  cardTitle: string;
  subText: string;
}

export default function LeadsCard({ leads, cardTitle, subText }: Props) {
  return (
    <div className="flex flex-col rounded-xl border bg-white">
      <div className="flex items-center justify-between py-4 px-5 lg:px-6 w-full">
        <h3 className="text-lg font-medium">{cardTitle}</h3>
      </div>
      <div className="pb-5 px-5 lg:pb-6 lg:px-6 grow w-full flex justify-between items-center">
        <dl>
          <dt className="text-2xl font-bold">{leads}</dt>
          <dd className="text-sm font-medium text-gray-500">{subText}</dd>
        </dl>
        <Delta number={8.4} isPositive={true} />
      </div>
    </div>
  );
}
