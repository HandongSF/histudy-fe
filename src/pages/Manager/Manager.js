import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { border, Box } from "@mui/system";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CustomTable from "../../components/common/CustomTable";
import LongButton from "../../components/common/LongButton";
import GrayBorderBox from "../../components/common/GrayBorderBox";
import ProgressBar from "../../components/common/ProgressBar";
import SideBar from "../../components/Manager/SideBar";
import YearSelectButton from "../../components/Manager/YearSelectButton";
import SemesterSelectButton from "../../components/Manager/SemesterSelectButton";
import RegisterClassButton from "../../components/Manager/RegisterClassButton";
import ManagerTable from "../../components/Manager/ManagerTable";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";
import Title from "../../components/Manager/Table/Title";

export default function Manager() {
  const classData = [
    ["Software Engineering", "ITP40002", "남재창"],
    ["Open-source Software Laboratories", "ITP20004", "홍참길 외 1명"],
    ["데이터 구조", "ECE20010", "김호준"],
    ["자바 프로그래밍 언어", "ECE20016", "남재창"],
    ["논리설계", "ECE20057", "이종원"],
  ];

  return (
    <Box sx={{ display: "flex", py: "50px", px: "300px" }}>
      <Box sx={{ position: "fixed", left: "30px", top: "50px" }}>
        <SideBar />
      </Box>
      <Box sx={{ width: "100%", ml: "50px" }}>
        <>
          <Box sx={{ display: "flex", mb: "3rem" }}>
            <YearSelectButton />
            <SemesterSelectButton />
          </Box>

          <StyledTitleFlexBox>
            <Title text={"등록된 수업 목록"} />
            <RegisterClassButton sx={{ ml: "auto" }} />
          </StyledTitleFlexBox>

          <ManagerTable
            data={classData}
            accentColumnNum={-1}
            longWidthColumnNum={-1}
            type="class"
          />
        </>
      </Box>
    </Box>
  );
}
