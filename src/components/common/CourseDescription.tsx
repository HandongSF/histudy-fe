import { Typography } from "@mui/material";

export default function CourseDescription() {
  return (
    <>
      <Typography sx={{ textAlign: "center" }}>
        스터디를 하고 싶은 희망 과목들을 담아주세요!
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
        최소 1과목, 최대 3과목
      </Typography>
    </>
  );
}
