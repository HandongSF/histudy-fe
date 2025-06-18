import {
  Button,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { border, Box } from "@mui/system";
import { useEffect, useState } from "react";
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
import { searchCourses } from "../../apis/course";
import { useSetRecoilState } from "recoil";
import { isLoadingState } from "../../store/atom";
import { motion } from "framer-motion";
import { StyledLayout } from "./style/StyledLatout";
import Title from "../../components/Manager/Table/Title";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";
import { useQuery } from "react-query";
import LoadingLayout from "../../components/Manager/Loading/LoadingLayout";

export default function ManageClass() {
  const [classData, setClassData] = useState();

  const { isLoading } = useQuery(["courses"], searchCourses, {
    casheTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      setClassData(data.courses);
    },
  });

  return (
    <StyledLayout>
      <LoadingLayout isLoading={isLoading}>
        <SideBar />

        <Box sx={{ width: "100%" }}>
          <StyledTitleFlexBox>
            <Title text="등록된 수업 목록" />
            <RegisterClassButton sx={{ ml: "auto" }} />
          </StyledTitleFlexBox>
          {classData && (
            <ManagerTable
              data={classData}
              accentColumnNum={-1}
              longWidthColumnNum={-1}
              type="class"
            />
          )}
        </Box>
      </LoadingLayout>
    </StyledLayout>
  );
}
