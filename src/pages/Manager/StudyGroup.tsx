import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import * as xlsx from "xlsx";
import { readAllGroups } from "../../apis/manager";
import LongButton from "../../components/common/LongButton";
import LoadingLayout from "../../components/Manager/Loading/LoadingLayout";
import StudyGroupTable from "../../components/Manager/StudyGroupTable";
import Title from "../../components/Manager/Table/Title";
import { StyledLayout } from "./style/StyledLatout";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";

export default function StudyGroup() {
  const [groupData, setGroupData] = useState();
  const [searchResult, setSearchResult] = useState();
  const [searchValue, setSearchValue] = useState("");

  const { isLoading } = useQuery(["courses"], readAllGroups, {
    cacheTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      setSearchResult(data);
      setGroupData(data);
    },
  });

  const [page, setPage] = useState(1);

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  let sheetData;

  if (groupData) {
    sheetData = groupData.flatMap((group) =>
      group.members.map((member) => ({
        Group: group.group,
        MemberID: member.id,
        MemberName: member.name,
        MemberNumber: member.sid,
        Friends: member.friends.map((friend) => friend.name).join(", "),
        Subjects: member.courses.map((subject) => subject.name).join(", "),
        Reports: group.reports,
        Times: group.times,
      }))
    );
  }
  // const xlsx = require("xlsx");

  const excelDownload = () => {
    if (groupData) {
      console.log("sheetData");
      console.log(sheetData);
      const ws = xlsx.utils.json_to_sheet([...sheetData]);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

      xlsx.writeFile(wb, "dramatis_personae.xlsx");
    } else {
      console.log("데이터가 비어있습니다.");
    }
  };

  useEffect(() => {
    if (searchValue) {
      let result;
      if (!isNaN(searchValue)) {
        result = groupData.filter((data) => data.group === Number(searchValue));
      } else {
        result = groupData.filter((data) => {
          return data.members.some((member) =>
            member.name.includes(searchValue)
          );
        });
      }

      setSearchResult(result);
    } else if (searchValue === "") {
      setSearchResult(groupData);
    }
  }, [searchValue]);

  const theme = useTheme();
  return (
    <StyledLayout>
      <LoadingLayout isLoading={isLoading}>
        <Box sx={{ width: "100%" }}>
          <StyledTitleFlexBox>
            <Title text={"그룹 활동 목록"} />
            <TextField
              id="search"
              type="search"
              value={searchValue}
              onChange={handleChange}
              sx={{
                width: "50%",
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
            <StudyGroupTable
              searchResult={searchResult}
              data={searchResult}
              accentColumnNum={-1}
              longWidthColumnNum={-1}
              type="studyGroup"
            />
          )}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <LongButton
              name="그룹 활동 목록 엑셀 다운"
              onClick={excelDownload}
              bgColor="primary.main"
              fontColor="white"
            />
          </Box>
        </Box>
      </LoadingLayout>
    </StyledLayout>
  );
}
