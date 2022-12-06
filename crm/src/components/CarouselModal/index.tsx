import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { LegacyRef, useState } from "react";
import Slider from "react-slick";
import Head from "next/head";

interface Props {
  children: React.ReactNode;
  sliderRef?: LegacyRef<Slider>;
}

const CarouselModal: React.FC<Props> = ({ children, sliderRef }) => {
  const [showModal, setShowModal] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
  };

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <Modal
        isCentered
        size="3xl"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`Photos`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            sx={{
              minH: 500,
            }}
          >
            <Slider ref={sliderRef} {...settings}>
              {children}
            </Slider>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                var next = document.querySelector(".slick-arrow.slick-next");
                if (next instanceof HTMLElement) {
                  next.click();
                }
              }}
              colorScheme="blue"
              mr={3}
              type="button"
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CarouselModal;
