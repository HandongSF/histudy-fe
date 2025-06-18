import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, styled, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import * as xlsx from "xlsx";
import { readAllStudyApplyUsers } from "../../apis/manager";
import LongButton from "../../components/common/LongButton";
import LoadingLayout from "../../components/Manager/Loading/LoadingLayout";
import StudentListTable from "../../components/Manager/StudentListTable";
import Title from "../../components/Manager/Table/Title";
import { isLoadingState } from "../../store/atom";
import { StyledLayout } from "./style/StyledLatout";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";

const StyledFlexButtonBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
});

export default function ManageStudent() {
  const [studentData, setStudentData] = useState();
  const [searchResult, setSearchResult] = useState();
  const [searchValue, setSearchValue] = useState("");
  const setIsLoading = useSetRecoilState(isLoadingState);

  const { isLoading } = useQuery(["users"], readAllStudyApplyUsers, {
    cacheTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      console.log("useQuery Data", data);
      setSearchResult(data);
      setStudentData(data);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  let sheetData;
  if (studentData) {
    sheetData = studentData.map((student) => ({
      ID: student.id,
      Name: student.name,
      StudentId: student.sid,
      Email: student.email,
      Group: student.group,
      Courses: student.courses
        .map((subject) => subject.name + `(${subject.prof})`)
        .join(", "),
      Friends: student.friends.map((friend) => friend.name).join(", "),
    }));
  }

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  // const xlsx = require("xlsx");
  const excelDownload = () => {
    const ws = xlsx.utils.json_to_sheet([...sheetData]);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

    xlsx.writeFile(wb, "dramatis_personae.xlsx");
  };

  useEffect(() => {
    if (searchValue) {
      let result;
      if (!isNaN(searchValue)) {
        result = studentData.filter(
          (data) => data.group === Number(searchValue)
        );
      } else {
        result = studentData.filter((data) => data.name.includes(searchValue));
      }
      setSearchResult(result);
    } else if (searchValue === "") {
      setSearchResult(studentData);
    }
  }, [searchValue]);
  const theme = useTheme();
  return (
    <StyledLayout>
      <LoadingLayout isLoading={isLoading}>
        <Box sx={{ width: "100%" }}>
          <>
            <StyledTitleFlexBox>
              <Title text={"스터디 신청자 목록"} />
              <TextField
                id="search"
                type="search"
                value={searchValue}
                onChange={handleChange}
                sx={{
                  width: "30rem",
                  borderRadius: "30px",
                  mb: 4,
                  "& .MuiInputBase-root": {
                    borderRadius: "30px",
                  },
                }}
                InputProps={{
                  style: {
                    backgroundColor: theme.palette.background.default,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="학생 이름, 그룹 검색"
              />
            </StyledTitleFlexBox>
            {searchResult && (
              <StudentListTable
                data={searchResult}
                accentColumnNum={-1}
                longWidthColumnNum={3}
                type="student"
              />
            )}
            <StyledFlexButtonBox>
              <LongButton
                name="목록 받기"
                onClick={excelDownload}
                bgColor="primary.main"
                fontColor="white"
              />
            </StyledFlexButtonBox>
          </>
        </Box>
      </LoadingLayout>
    </StyledLayout>
  );
}
