import { Box, Button, TextField, Typography } from "@mui/material";

export default function RegisterModal({ setSid, handleClick, sid }) {
  return (
    <Box sx={{ display: "absolute" }}>
      <Box
        sx={{
          zIndex: "100",
          position: "absolute",

          top: "62%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // border: 1,
          // borderColor: "primary.light",
          backgroundColor: "primary.lighter",
          borderRadius: "20px",
          width: "430px",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: " center",
        }}
      >
        <Typography sx={{ fontSize: "23px", color: "text.default" }}>
          정보 입력하기
        </Typography>

        {/* <TextField
            className="login-textInput"
            sx={{ mt: "40px", width: "300px", zIndex: 1300 }}
            label="Name"
            variant="outlined"
            value={userLoginInfoState?.name}
          /> */}
        <TextField
          className="login-textInput"
          sx={{ my: "50px", width: "300px" }}
          label="학번"
          variant="outlined"
          value={sid}
          onChange={(e) => setSid(e.target.value)}
        />
        {/* <TextField
            className="login-textInput"
            sx={{ mt: "15px", width: "300px" }}
            label="Email"
            variant="outlined"
            value={userLoginInfoState?.email}
          /> */}
        <Button
          variant="contained"
          sx={{ width: "100px" }}
          onClick={handleClick}
        >
          가입완료
        </Button>
      </Box>
    </Box>
  );
}
