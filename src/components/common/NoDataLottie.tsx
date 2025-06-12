import { Box, Typography, styled } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../../noData.json";

const StyledFlexColumnBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export default function NoDataLottie() {
  return (
    <StyledFlexColumnBox>
      <Lottie animationData={animationData} style={{ width: "250px" }} />
      <Typography
        variant="body1"
        sx={{ textAlign: "center", mt: "20px", fontSize: "20px" }}
      >
        아직 데이터가 없습니다!
      </Typography>
    </StyledFlexColumnBox>
  );
}
