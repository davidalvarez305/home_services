import { GrClose } from "react-icons/gr";
import { IconButton } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface Props {
  minusButton: MouseEventHandler<SVGElement>;
}

const DeleteButton: React.FC<Props> = ({ minusButton }) => {
  return (
    <IconButton
      aria-label={"removeUsers"}
      icon={<GrClose size={20} onClick={minusButton} />}
      variant={"outline"}
      colorScheme={"red"}
    />
  );
};

export default DeleteButton;
