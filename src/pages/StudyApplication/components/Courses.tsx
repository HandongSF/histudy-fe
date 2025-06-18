import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, useTheme } from "@mui/material";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { searchCourses } from "../../../apis/course";
import CustomTable from "../../../components/common/CustomTable";
import { TextFieldWrapper } from "./TextFieldWrapper";

const getLowerTrimed = (str) => {
  return str.toLowerCase().trim().toLowerCase().replace(/\s+/g, "");
};

const courseConverter = (allCourses, courseInput) => {
  const result = [];

  const lowerTrimedInput = getLowerTrimed(courseInput);

  const newArr = !!!courseInput
    ? allCourses
    : allCourses.filter(
        (course) =>
          getLowerTrimed(course.name).includes(lowerTrimedInput) ||
          getLowerTrimed(course.prof).includes(lowerTrimedInput) ||
          getLowerTrimed(course.code).includes(lowerTrimedInput)
      );

  newArr.forEach((elem) =>
    result.push([elem.name, elem.code, elem.prof, elem.id])
  );

  return result;
};

export default function Courses({ sideCourses, setSideCourses }) {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const [courseInput, setCourseInput] = useState("");
  const theme = useTheme();

  const updateCourses = useCallback(
    debounce((allCourses, courseInput) => {
      setCourses(courseConverter(allCourses, courseInput));
    }, 300), // 300ms 디바운스 적용
    []
  );

  useEffect(() => {
    if (!allCourses) return;

    updateCourses(allCourses, courseInput);
  }, [allCourses, courseInput, updateCourses]);

  useEffect(() => {
    searchCourses("").then((res) => {
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
        placeholder="과목명 검색"
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
