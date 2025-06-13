import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProfile } from "../../apis/users";

export default function Profile() {
  const [profile, setProfile] = useState();

  useEffect(() => {
    getProfile().then((res) => {
      setProfile(res);
    });
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        height: "100vh",
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontSize: "30px", fontWeight: "300", mt: "50px" }}>
        😀 마이페이지
      </Typography>
      <Box
        sx={{
          p: "30px",
          border: 2,
          borderRadius: "20px",
          width: "280px",
          mt: "100px",
          mb: "15px",
          backgroundColor: "background.sidebar",
          borderColor: "lightGray",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{ mb: "10px", textAlign: "center", fontWeight: "600" }}
        >
          이름 , 학번
        </Typography>
        <AnimatePresence>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            sx={{
              mb: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
            }}
          >
            {profile?.name}, {profile?.sid}
          </Box>
        </AnimatePresence>

        <Typography variant="body1" sx={{ mb: "10px", fontWeight: "600" }}>
          이메일
        </Typography>
        <AnimatePresence>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "primary.main",
            }}
          >
            {profile?.email}
          </Box>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
