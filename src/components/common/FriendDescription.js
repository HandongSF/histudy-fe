import { Typography } from "@mui/material";

export default function FriendDescription() {
  return (
    <>
      <Typography sx={{ textAlign: "center", fontWeight: "400" }}>
        스터디를 함께하고 싶은 친구가 있다면 추가하세요!
      </Typography>
      <Typography
        sx={{
          color: "primary.main",
          textAlign: "center",
          mt: "5px",
          mb: "30px",
          fontWeight: "600",
        }}
      >
        서로 함께 하고 싶은 친구로 신청해야 매칭됩니다! (최대 4명)
      </Typography>
    </>
  );
}
