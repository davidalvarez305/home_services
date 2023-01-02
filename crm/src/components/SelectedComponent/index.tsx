import { MouseEventHandler } from "react";
import SmallXIcon from "../../assets/SmallXIcon";

interface Props {
  selected: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export const SelectedComponent: React.FC<Props> = ({ selected, onClick }) => {
  return (
    <div className="p-3 text-center" onClick={onClick}>
      <button
        type="button"
        className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-2 py-1 leading-5 text-sm rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none"
      >
        <SmallXIcon />
        <span>{selected}</span>
      </button>
    </div>
  );
};
