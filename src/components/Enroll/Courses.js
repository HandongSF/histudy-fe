import { Box, InputAdornment, TextField, useTheme } from "@mui/material";
import CustomTable from "../common/CustomTable";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { autoCourses } from "../../apis/course";
import styled from "styled-components";
import { TextFieldWrapper } from "./TextFieldWrapper";

export default function Courses({ sideCourses, setSideCourses }) {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const [courseInput, setCourseInput] = useState("");

  const courseConverter = (allCourses) => {
    const result = [];

    const newArr =
      courseInput === ""
        ? allCourses
        : allCourses.filter(
            (course) =>
              // 과목 이름 확인
              course.name
                ?.toLowerCase()
                .replace(" ", "")
                .includes(courseInput?.toLowerCase().replace(" ", "")) ||
              // 과목 교수님 확인
              course.prof
                ?.toLowerCase()
                .replace(" ", "")
                .includes(courseInput?.toLowerCase().replace(" ", "")) ||
              //과목 코드 확인
              course.code
                ?.toLowerCase()
                .replace(" ", "")
                .includes(courseInput?.toLowerCase().replace(" ", ""))
          );
    newArr.map((elem) => {
      result.push([elem.name, elem.code, elem.prof, elem.id]);
    });

    return result;
  };
  const theme = useTheme();

  useEffect(() => {
    setCourses(courseConverter(allCourses));
  }, [allCourses, courseInput]);

  useEffect(() => {
    autoCourses().then((res) => {
      setAllCourses(res.courses);
    });
  }, []);
  const handleChange = (event) => {
    // if (event.target.id === "friend") setFriendInput(event.target.value);
    // else {
    // courseInput onChange
    setCourseInput(event.target.value);
    // }
  };

  return (
    <Box
      sx={{
        width: { lg: "70vw", md: "90vw", xs: "90vw" },
        overflow: "scroll",
      }}
    >
      <TextFieldWrapper
        id="study"
        type="search"
        value={courseInput}
        onChange={handleChange}
        sx={{ minWidth: "800px", width: "100%", borderRadius: "30px", mb: 4 }}
        InputProps={{
          style: { backgroundColor: theme.palette.background.default },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        placeholder="과목명 | 교수명 | 과목코드"
      />

      <CustomTable
        sidebarValues={sideCourses}
        addData={setSideCourses}
        data={courses}
        accentColumnNum={-1}
        longWidthColumnNum={1}
        type="second"
      />
    </Box>
  );
}
