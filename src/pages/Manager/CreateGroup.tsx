import { Button, InputAdornment, TextField, Typography } from "@mui/material";
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
import GroupTable from "../../components/Manager/GroupTable";
import UnGroupTable from "../../components/Manager/UnGroupTable";
import GroupTables from "../../components/Manager/GroupTables";
import CreateGroupTable from "../../components/Manager/CreateGroupTable";
import MatchStartButton from "../../components/Manager/MatchStartButton";
import { readApplicants } from "../../apis/manager";
import { useSetRecoilState } from "recoil";
import { isLoadingState } from "../../store/atom";
import Title from "../../components/Manager/Table/Title";
import { StyledLayout } from "./style/StyledLatout";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";
import LoadingLayout from "../../components/Manager/Loading/LoadingLayout";
import { useQuery } from "react-query";

export default function CreateGroup() {
  const [allData, setAllData] = useState();

  const { isLoading } = useQuery(["courses"], readApplicants, {
    casheTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      setAllData(data);
    },
  });

  return (
    <StyledLayout>
      <LoadingLayout isLoading={isLoading}>
        <SideBar />

        <Box sx={{ width: "100%" }}>
          <StyledTitleFlexBox>
            <Title text={"신청자 리스트"} />
            <MatchStartButton />
          </StyledTitleFlexBox>
          {allData && (
            <CreateGroupTable
              data={allData}
              accentColumnNum={-1}
              longWidthColumnNum={-1}
              type="all"
            />
          )}
        </Box>
      </LoadingLayout>
    </StyledLayout>
  );
}
