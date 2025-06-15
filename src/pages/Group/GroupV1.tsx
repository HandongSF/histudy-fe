import { Box, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import GrayBorderBox from "../../components/common/GrayBorderBox";
import LongButton from "../../components/common/LongButton";
import { getMyGroup } from "../../apis/study";
import { Link } from "react-router-dom";
import NoDataLottie from "../../components/common/NoDataLottie";
import { getMyTeamUsers } from "../../apis/users";
import CustomTable from "../../components/common/CustomTable";
import { motion } from "framer-motion";
import Title from "../../components/common/Title";
import { StyledColumnAlignLayout } from "../../components/common/StyledLayout";
import { useQueries } from "react-query";

const StyledScrollTableSize = styled(Box)({
  width: "90%",
  maxWidth: "900px",
  overflow: "scroll",
});

const teamMembersConverter = (teamMembers) => {
  return [
    ...teamMembers?.map((teamMember) => {
      const memberRow = [teamMember.name, teamMember.sid, teamMember.email];

      return memberRow;
    }),
  ];
};

export default function Group({ setReApply }) {
  const [teamNum, setTeamNum] = useState();

  const [courses, setCourses] = useState([]);
  const [friends, setFriends] = useState([]);

  const [convertedCourses, setConvertedCourses] = useState([]);
  const [convertedFriends, setConvertedFriends] = useState([]);

  const [teamMembers, setTeamMembers] = useState([]);
  const [convertedTeamMembers, setConvertedTeamMembers] = useState([]);

  const [hasTeam, setHasTeam] = useState(false);

  const results = useQueries([
    {
      queryKey: ["myGroup"],
      queryFn: getMyGroup,

      cacheTime: 5 * 60 * 1000,
      onSuccess: (data) => {
        setCourses(data.courses);
        setConvertedCourses(
          data.courses.map((course) => [course.name, course.prof, course.code])
        );
        setFriends(data.friends);
        setConvertedFriends(
          data.friends.map((friend) => [friend.name, friend.sid])
        );
      },
    },
    {
      queryKey: ["myTeamUsers"],
      queryFn: getMyTeamUsers,

      cacheTime: 5 * 60 * 1000,
      onSuccess: (data) => {
        setTeamMembers(data);

        if (data.length === 0) setHasTeam(false);
        else setHasTeam(true);
        setTeamNum(data[0].tag);
        setConvertedTeamMembers(teamMembersConverter(data));
      },
    },
  ]);

  return (
    <StyledColumnAlignLayout
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Title text={`스터디 그룹 정보 (Group ${teamNum ? teamNum : ""})`} />
      {hasTeam ? (
        <StyledScrollTableSize>
          <CustomTable
            data={convertedTeamMembers}
            accentColumnNum={-1}
            longWidthColumnNum={-1}
            type="group"
          />
        </StyledScrollTableSize>
      ) : convertedCourses.length === 0 && convertedFriends.length === 0 ? (
        <Box>
          <NoDataLottie />
        </Box>
      ) : (
        <>
          <Typography sx={{ mt: "10px", mb: "30px" }}>
            스터디 그룹이 아직 배정되지 않았어요😅
          </Typography>

          <GrayBorderBox
            courses={convertedCourses}
            friends={convertedFriends}
          />

          <Link
            to="/enroll"
            state={{
              courses,
              friends,
            }}
          >
            <LongButton
              onClick={(e) => {
                setReApply(false);
              }}
              name="신청 수정하기"
              bgColor="primary.main"
              fontColor="white"
            />
          </Link>
        </>
      )}
    </StyledColumnAlignLayout>
  );
}
