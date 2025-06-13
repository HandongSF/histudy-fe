import { Button } from "@mui/material";

export default function LongButton({ onClick, name, bgColor, fontColor }) {
  return (
    <Button
      id={name}
      onClick={onClick}
      sx={{
        fontSize: "16px",
        py: "4px",
        px: 6,
        mt: 2,
        backgroundColor: bgColor,
        color: fontColor,
      }}
    >
      {name}
    </Button>
  );
}
