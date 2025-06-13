import { Box, Button } from "@mui/material";

export default function LoginButton() {
  return (
    <Box sx={{ display: "flex-col", justifyContent: "center" }}>
      <Button
        sx={{
          backgroundColor: "primary.light",
          color: "primary.main",
          paddingX: "20px",
          paddingY: "10px",
          fontSize: "16px",
        }}
      >
        {" "}
        Google 계정으로 로그인 하기
      </Button>
    </Box>
  );
}
