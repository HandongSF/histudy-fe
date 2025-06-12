import FaceIcon from "@mui/icons-material/Face";
import { Box, Chip, styled } from "@mui/material";
import { motion } from "framer-motion";

const StyledChip = styled(Chip)({
  zIndex: 10,
  color: "white",
  backgroundColor: "grey",
  fontWeight: "bold",
  fontSize: "12px",
});

const StyledFlexWrap = styled(Box)({
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
});

const StyledSizedBox = styled(Box)({
  display: "flex",
  gap: "10px",
});

const StyledHoverBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  position: "absolute",
  justifyContent: "space-between",
  left: 0,
  top: 0,
  paddingRight: "15px ",
  paddingLeft: "15px ",
  paddingTop: "70px",
  paddingBottom: "30px",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
});

export default function HoverBox({ members, reports, totalMinutes }) {
  return (
    // <AnimatePresence>
    <StyledHoverBox
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StyledFlexWrap>
        {members.map((member, index) => (
          <StyledChip
            key={index}
            icon={<FaceIcon sx={{ fill: "white" }} />}
            label={`${member.slice(0, 5)}`}
            variant="outlined"
          />
        ))}
      </StyledFlexWrap>

      <StyledSizedBox>
        <StyledChip label="보고서 총 갯수" variant="outlined" />
        <StyledChip label={`${reports}개`} />
      </StyledSizedBox>
      <StyledSizedBox>
        <StyledChip label="스터디 총 시간" variant="outlined" />
        <StyledChip label={`${totalMinutes} 분`} />
      </StyledSizedBox>
    </StyledHoverBox>
  );
}
