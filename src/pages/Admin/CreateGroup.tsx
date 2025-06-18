import { Box } from "@mui/system";
import { useState } from "react";
import { useQuery } from "react-query";
import { readApplicants } from "../../apis/manager";
import CreateGroupTable from "./components/CreateGroupTable";
import LoadingLayout from "./components/Loading/LoadingLayout";
import MatchStartButton from "./components/MatchStartButton";
import Title from "./components/Table/Title";
import { StyledLayout } from "./style/StyledLatout";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";

export default function CreateGroup() {
  const [allData, setAllData] = useState();

  const { isLoading } = useQuery(["courses"], readApplicants, {
    cacheTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      setAllData(data);
    },
  });

  return (
    <StyledLayout>
      <LoadingLayout isLoading={isLoading}>
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
