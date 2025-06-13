import { Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import CustomTable from "../../components/common/CustomTable";
import GrayBorderBox from "../../components/common/GrayBorderBox";
import ProgressBar from "../../components/common/ProgressBar";
import Friends from "../../components/Enroll/Friends";
import Courses from "../../components/Enroll/Courses";
import { getMyGroup, studyEnroll } from "../../apis/study";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Group from "../Group/Group";
import { useQuery } from "react-query";
import FriendDescription from "../../components/common/FriendDescription";
import CourseDescription from "../../components/common/CourseDescription";
import ButtonBox from "../../components/Enroll/ButtonBox";

const ResponsiveSidebarContainer = styled("div")({
  "@media (min-width: 1200px)": {
    display: "flex",
  },
  display: "none",
  flexDirection: "column",
});

const StyledCustomTableContainer = styled(Box)(({ reApply }) => ({
  display: "flex",
  padding: reApply ? "0px 0px" : "60px 0px",
  overflowX: "scroll",
  minHeight: "100vh",
  justifyContent: "center",
}));

const StyledTitle = styled(Typography)({
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "25px",
  fontWeight: "400",
});

export default function Enroll() {
  const [reApply, setReApply] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [sideFriends, setSideFriends] = useState([]);
  const [sideCourses, setSideCourses] = useState([]);

  useEffect(() => {
    if (location.state) {
      setSideCourses(
        location.state.courses.map((course) => [
          course.name,
          course.code,
          course.prof,
          course.id,
        ])
      );
      setSideFriends(
        location.state.friends.map((friend) => [friend.name, friend.sid])
      );
    }
  }, []);

  /**
   * 내가 신청한 스터디가 있는지 확인
   */

  const { isLoading } = useQuery(["checkMyApplication"], getMyGroup, {
    casheTime: 1 * 30 * 1000,
    onSuccess: (data) => {
      if (data.courses.length !== 0) {
        setReApply(true);
        setSideCourses(
          data.courses.map((course) => [
            course.name,
            course.code,
            course.prof,
            course.id,
          ])
        );
        setSideFriends(data.friends.map((friend) => [friend.name, friend.sid]));
      }
    },
  });

  const handleClick = (event) => {
    const ID = event.target.id;

    if (ID === "다음") setPage((prev) => prev + 1);
    else if (ID === "이전") setPage((prev) => prev - 1);
    else if (ID === "제출") {
      const data = {
        friendIds: sideFriends.map((elem) => elem[1]),
        courseIds: sideCourses.map((elem) => elem[3]),
      };
      if (data.courseIds.length === 0) {
        alert("과목을 최소 1개는 선택해야 합니다.");
        return;
      }
      alert("스터디 신청이 완료되었습니다.");
      studyEnroll(data);
      navigate("/");
    }
  };

  const rankConverter = (sideCourses) => {
    // let i = 1;
    const result = [];
    sideCourses.map((elem) => {
      result.push([elem[0], elem[1], elem[2]]);
    });
    return result;
  };

  return (
    <StyledCustomTableContainer
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      reApply={reApply}
    >
      {reApply ? (
        <Group setReApply={setReApply} />
      ) : (
        <Box sx={{ display: "flex", gap: "35px", alignItems: "start" }}>
          <ResponsiveSidebarContainer>
            <ProgressBar page={page} setPage={setPage} />
            <GrayBorderBox
              reApply={reApply}
              courses={sideCourses}
              friends={sideFriends}
              setSideCourses={setSideCourses}
              setSideFriends={setSideFriends}
            />
          </ResponsiveSidebarContainer>
          <Box>
            <StyledTitle>Histudy 신청하기</StyledTitle>

            {page === 1 && (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FriendDescription />
                <Friends
                  sideFriends={sideFriends}
                  setSideFriends={setSideFriends}
                />

                <ButtonBox left="다음" right="없음" handleClick={handleClick} />
              </Box>
            )}

            {page === 2 && (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CourseDescription />
                <Courses
                  sideCourses={sideCourses}
                  setSideCourses={setSideCourses}
                />
                <ButtonBox left="이전" right="다음" handleClick={handleClick} />
              </Box>
            )}
            {page === 3 && (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Typography
                  sx={{ textAlign: "center", height: "50px", mb: "30px" }}
                >
                  스터디 희망 과목의 우선 순위를 정해주세요!
                </Typography>

                <Box
                  sx={{
                    width: { lg: "70vw", md: "90vw", xs: "90vw" },
                    overflow: "scroll",
                  }}
                >
                  <CustomTable
                    data={sideCourses}
                    addData={setSideCourses}
                    accentColumnNum={-1}
                    longWidthColumnNum={2}
                    type="third"
                  />
                </Box>

                <ButtonBox left="이전" right="제출" handleClick={handleClick} />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </StyledCustomTableContainer>
  );
}
