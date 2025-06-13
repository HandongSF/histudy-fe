import { Box } from "@mui/material";
import animationData from "../loading.json";
import Lottie from "lottie-react";

export default function LoadingLottie() {
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

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
