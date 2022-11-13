import { GrClose } from "react-icons/gr";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

type Props = IconButtonProps;

const DeleteButton: React.FC<Props> = ({ ...props }) => {
  return (
    <IconButton
      icon={<GrClose size={20} />}
      variant={"outline"}
      colorScheme={"red"}
      {...props}
    />
  );
};

export default DeleteButton;
