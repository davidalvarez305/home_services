import { GrClose } from "react-icons/gr";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

type Props = IconButtonProps & {
  minusButton: MouseEventHandler<SVGElement>;
};

const DeleteButton: React.FC<Props> = ({
  minusButton,
  ...props
}) => {
  return (
    <IconButton
      icon={<GrClose size={20} onClick={minusButton} />}
      variant={"outline"}
      colorScheme={"red"}
      {...props}
    />
  );
};

export default DeleteButton;
