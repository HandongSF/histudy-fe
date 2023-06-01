import {
  Autocomplete,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { border, Box } from "@mui/system";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CustomTable from "../../components/CustomTable";
import LongButton from "../../components/LongButton";
import GrayBorderBox from "../../components/GrayBorderBox";
import ProgressBar from "../../components/ProgressBar";
import { autoCourses, getCourses, teamCourses } from "../../apis/course";

export default function Enroll() {
  const [allCourses, setAllCourses] = useState([]);
  // const []

  const [courses, setCourses] = useState([]);

  const courseConverter = (allCourses) => {
    const result = [];

    const newArr = allCourses.filter((course) =>
      course.name.includes(courseInput)
    );
    newArr.map((elem) => {
      result.push([elem.name, elem.code, elem.prof]);
      // console.log([elem.name, elem.code, elem.prof]);
    });

    return result;
  };

  const [courseInput, setCourseInput] = useState("");
  // useEffect(() => {
  //   // setCourses(courseConverter(allCourses));
  //   // console.log(courseConverter(allCourses));
  // }, []);

  const [studies, setStudies] = useState([
    { name: "알고리즘 분석", professor: "이원형 교수님" },
    { name: "데이타 베이스", professor: "홍참길 교수님" },
  ]);

  const [friends, setFriends] = useState([
    {
      name: "오인혁",
      id: "21800446",
    },
    {
      name: "한시온",
      id: "21800888",
    },
  ]);

  const firstData = [
    ["오인혁", "21800446", "8156217@naver.com"],
    ["한시온", "21800446", "8156217@naver.com"],
    ["배주영", "21800446", "8156217@naver.com"],
    ["이인혁", "21800446", "8156217@naver.com"],
    ["김진수", "21800446", "8156217@naver.com"],
  ];

  const secondDate = [
    ["Open-source Software Laboratories", "0000000", "홍참길"],
    ["Open-source Software Laboratories", "0000000", "홍참길"],
    ["Open-source Software Laboratories", "0000000", "홍참길"],
    ["Open-source Software Laboratories", "0000000", "홍참길"],
  ];

  const thirdData = [
    ["1", "알고리듬분석", "ECE40008", "용환기"],
    ["2", "RF회로 설계", "ECE30011", "김영식"],
  ];
  const [page, setPage] = useState(1);

  const [friendInput, setFriendInput] = useState("");
  const handleChange = (event) => {
    if (event.target.id === "friend") setFriendInput(event.target.value);
    else {
      // courseInput onChange
      setCourseInput(event.target.value);
    }
  };

  //  courseInput의 변화 감지
  useEffect(() => {
    setCourses(courseConverter(allCourses));
  }, [courseInput]);

  // useEffect(() => {
  //   autoCourses().then((res) => {
  //     setAllCourses([...res.courses.map((course) => course.name)]);
  //   });
  // }, [friendInput]);

  useEffect(() => {
    autoCourses().then((res) => {
      setAllCourses(res.courses);
    });
  }, []);

  const handleClick = (event) => {
    const ID = event.target.id;
    console.log(ID);
    if (ID === "다음") setPage((prev) => prev + 1);
    else if (ID === "이전") setPage((prev) => prev - 1);
    else if (ID === "제출") alert("제출되었습니다.");
  };

  return (
    <Box sx={{ display: "flex", py: "50px", px: "300px" }}>
      <Box sx={{ position: "fixed", left: "30px", top: "50px" }}>
        <ProgressBar page={page} />
        <GrayBorderBox studies={studies} friends={friends} />
      </Box>
      <Box sx={{ width: "100%", ml: "50px" }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Histudy 신청하기
        </Typography>

        {page === 1 && (
          <>
            <Typography sx={{ textAlign: "center", height: "50px" }}>
              스터디를 함께하고 싶은 친구를 등록하세요!
            </Typography>

            <TextField
              id="friend"
              type="search"
              label="Search"
              value={friendInput}
              onChange={handleChange}
              sx={{ width: "100%", borderRadius: "30px", mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="친구 이름 검색"
            />
            <CustomTable
              data={firstData}
              accentColumnNum={-1}
              longWidthColumnNum={-1}
              type="first"
            />
            <Typography
              sx={{ color: "primary.main", textAlign: "center", mt: 4 }}
            >
              서로 함께 하고 싶은 친구로 신청해야 매칭됩니다!
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <LongButton
                name="다음"
                onClick={handleClick}
                bgColor="primary.main"
                fontColor="white"
              />
            </Box>
          </>
        )}

        {page === 2 && (
          <>
            <Typography sx={{ textAlign: "center", height: "50px" }}>
              스터디를 하고 싶은 희망 과목들을 담아주세요!
            </Typography>

            <TextField
              id="study"
              type="search"
              label="Search"
              value={courseInput}
              onChange={handleChange}
              sx={{ width: "100%", borderRadius: "30px", mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="과목명 검색"
            />
            {/* <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={allCourses}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            /> */}
            <CustomTable
              data={courses}
              accentColumnNum={-1}
              longWidthColumnNum={1}
              type="second"
            />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  mt: 5,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <LongButton
                  name="이전"
                  onClick={handleClick}
                  bgColor="primary.border"
                  fontColor="primary.main"
                />
                <LongButton
                  name="다음"
                  onClick={handleClick}
                  bgColor="primary.main"
                  fontColor="white"
                />
              </Box>
            </Box>
          </>
        )}
        {page === 3 && (
          <>
            <Typography sx={{ textAlign: "center", height: "50px" }}>
              스터디 희망 과목의 우선 순위를 정해주세요!
            </Typography>

            <CustomTable
              data={thirdData}
              accentColumnNum={1}
              longWidthColumnNum={2}
              type="third"
            />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  mt: 5,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <LongButton
                  name="이전"
                  onClick={handleClick}
                  bgColor="primary.border"
                  fontColor="primary.main"
                />
                <LongButton
                  name="제출"
                  onClick={handleClick}
                  bgColor="primary.main"
                  fontColor="white"
                />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
