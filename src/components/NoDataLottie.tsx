import { Box, Typography } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../noData.json";

export default function NoDataLottie() {
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie animationData={animationData} style={{ width: "250px" }} />
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mt: "50px", ml: "20px" }}
      >
        데이터가 없습니다
      </Typography>
    </Box>
  );
}
