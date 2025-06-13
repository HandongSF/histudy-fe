import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LayoutVariant = {
  hidden: {
    opacity: 0,
  },
  showing: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

function updateCurrentTime() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // 결과를 화면에 표시하는 코드
  return formattedTime;
}

// 매 초마다 updateCurrentTime 함수를 실행
setInterval(updateCurrentTime, 1000);

export function CodeModal({ onClick }) {
  const [nowTime, setNowTime] = useState(updateCurrentTime());
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(updateCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component={motion.div}
        variants={LayoutVariant}
        initial="hidden"
        animate="showing"
        exit="exit"
        onClick={onClick}
        id="no"
        sx={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          zIndex: "10",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <Box
          sx={{
            position: "absolute",

            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "20",
            width: "50%",
            height: "500px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component={motion.img}
            src={"/img/authImg.jpg"}
            width={300}
            height={300}
            // sx={{ borderRadius: "30px" }}
            alt="histudy_logo"
          />
          <Typography variant="h3" sx={{ mt: 5 }}>
            {nowTime}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
