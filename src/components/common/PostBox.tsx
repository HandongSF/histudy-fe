import { Box } from "@mui/material";

export default function PostBox({ children }) {
  return (
    <Box
      sx={{
        padding: "30px",
        border: 1,
        borderColor: "primary.main",
        backgroundColor: "primary.lighter",
        borderRadius: "30px",
        mb: "30px",
      }}
    >
      {children}
    </Box>
  );
}
