import { Box, styled } from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const StyledUpdownButtonBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export default function UpDownButton({ data, addData, index }) {
  const handleUpButtonClick = (index) => {
    if (0 >= index) return;
    const temp = data[index];

    addData((prev) => {
      const newData = [
        ...prev.slice(0, index - 1),
        temp,
        prev[index - 1],
        ...prev.slice(index + 1),
      ];

      return newData;
    });
  };

  const handleDownButtonClick = (index) => {
    if (data.length - 1 <= index) return;
    const temp = data[index];

    addData((prev) => [
      ...prev.slice(0, index),
      prev[index + 1],
      temp,
      ...prev.slice(index + 2),
    ]);
  };

  return (
    <StyledUpdownButtonBox>
      <KeyboardArrowUpIcon onClick={() => handleUpButtonClick(index)} />
      <KeyboardArrowDownIcon onClick={() => handleDownButtonClick(index)} />
    </StyledUpdownButtonBox>
  );
}
