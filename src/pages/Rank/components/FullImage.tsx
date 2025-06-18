import { Box, Modal } from "@mui/material";
import React from "react";
import { useRecoilState } from "recoil";
import { isShowFullImageState } from "../../../store/atom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface FullImageProps {
  fullImageUrl: string;
}

function FullImageComponent({ fullImageUrl }: FullImageProps) {
  const [isShowFullImage, setIsShowFullImage] =
    useRecoilState(isShowFullImageState);

  const handleClose = () => setIsShowFullImage(false);
  return (
    <Modal
      open={isShowFullImage}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="img" src={fullImageUrl} sx={style} />
    </Modal>
  );
}

const FullImage = React.memo(FullImageComponent);

export default FullImage;
