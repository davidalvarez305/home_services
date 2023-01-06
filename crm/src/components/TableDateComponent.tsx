import { v4 as uuidv4 } from "uuid";

interface Props {
    date: number;
}

export default function TableDateComponent({ date }:Props) {
  const t = new Date(0);
  return (
    <td className="p-3 text-center" key={uuidv4()}>
      {new Date(t.setUTCSeconds(date)).toLocaleDateString()}
    </td>
  );
}
