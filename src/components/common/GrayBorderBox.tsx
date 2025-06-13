import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useMatch } from "react-router-dom";
import DeleteDataIcon from "../Enroll/DeleteDataIcon";

const maskingSid = (sid) => {
  return sid.slice(0, 3) + "****" + sid.slice(-1);
};

export default function GrayBorderBox({
  reApply,
  setSideFriends,
  setSideCourses,
  friends,
  courses,
  children,
}) {
  const enrollMatch = useMatch("/enroll");

  return (
    <Box
      sx={{
        zIndex: 20,
        p: "30px",
        border: 2,
        borderRadius: "20px",
        width: "280px",

        mb: "15px",
        backgroundColor: "background.sidebar",
        borderColor: "lightGray",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" sx={{ mb: "30px", textAlign: "center" }}>
        신청 내역
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        함께하고 싶은 친구
      </Typography>
      <AnimatePresence>
        {friends.length !== 0 &&
          friends.map((friend, index) => (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                key={index}
                variant="body1"
                sx={{ color: "primary.main" }}
              >
                {friend[0]}, {maskingSid(friend[1])}
              </Typography>
              {enrollMatch && setSideFriends && (
                <DeleteDataIcon setData={setSideFriends} compData={friend[1]} />
              )}
            </Box>
          ))}
      </AnimatePresence>
      <Typography variant="body1" sx={{ mb: 1, mt: 3 }}>
        스터디 희망 과목
      </Typography>
      <AnimatePresence>
        {courses.length !== 0 &&
          courses.map((course, index) => (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                key={index}
                variant="body1"
                sx={{ color: "primary.main", fontSize: "13px" }}
              >
                {course[0]} , {course[1]} , {course[2]}
              </Typography>
              {enrollMatch && setSideCourses && (
                <DeleteDataIcon setData={setSideCourses} compData={course[1]} />
              )}
            </Box>
          ))}
      </AnimatePresence>
      {children}
    </Box>
  );
}
