import { Box, Typography } from "@mui/material";

export default function ProgressBar({ page, setPage }) {
  return (
    <Box
      sx={{
        //   border: 1,
        mt: "85px",
        mb: "40px",
        minWidth: "290px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {[1, 2, 3].map((pageNavNum, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                // fontWeight: "bold",
                fontWeight: "500",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "25px",
                width: "35px",
                height: "35px",
                borderRadius: "5px",
                paddingTop: "3px",
                border: 2,
                borderColor: "primary.main",
                backgroundColor: pageNavNum <= page ? "primary.main" : "white",
                color: pageNavNum <= page ? "white" : "primary.main",
              }}
              onClick={() => setPage(pageNavNum)}
            >
              {pageNavNum}
            </Box>
            {pageNavNum !== 3 && (
              <Box
                sx={{
                  width: "65px",
                  height: "3px",
                  backgroundColor: "lightGray",
                }}
              ></Box>
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ color: "gray", display: "flex", mt: "10px", mr: "10px" }}>
        <Typography variant="body2">함께할 친구 등록</Typography>
        <Typography variant="body2" sx={{ mx: 2 }}>
          희망 과목 선택
        </Typography>
        <Typography variant="body2">우선 순위 설정</Typography>
      </Box>
    </Box>
  );
}
