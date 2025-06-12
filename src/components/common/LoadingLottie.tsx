import { Box } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../../loading.json";

export default function LoadingLottie() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",

          transform: "translate(-50%, -50%)",
          opacity: 1,
          pointerEvents: "none",
        }}
      >
        <Lottie style={{ width: "200px" }} animationData={animationData} />
      </Box>
    </Box>
  );
}
