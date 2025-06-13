import { Box } from "@mui/material";
import LongButton from "../common/LongButton";

export default function ButtonBox({ handleClick, left, right }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          mt: 5,
          display: "flex",
          justifyContent: right === "없음" ? "center" : "space-between",
          width: "300px",
        }}
      >
        <LongButton
          name={left}
          onClick={handleClick}
          bgColor="primary.lighter"
          fontColor="primary.main"
        />
        {right !== "없음" && (
          <LongButton
            name={right}
            onClick={handleClick}
            bgColor="primary.main"
            fontColor="white"
          />
        )}
      </Box>
    </Box>
  );
}
