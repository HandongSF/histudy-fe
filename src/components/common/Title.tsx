import { Typography, styled } from "@mui/material";

const StyledTypography = styled(Typography)({
  fontSize: "30px",
  fontWeight: "300",
  marginBottom: "70px",
});

export default function Title({ text }) {
  return <StyledTypography>{text}</StyledTypography>;
}
