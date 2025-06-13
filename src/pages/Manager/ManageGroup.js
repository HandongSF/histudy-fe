import { styled } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import SideBar from "../../components/Manager/SideBar";
import UnGroupTable from "../../components/Manager/UnGroupTable";
import GroupTables from "../../components/Manager/GroupTables";
import { readAllGroups, readUngroup } from "../../apis/manager";
import { useSetRecoilState } from "recoil";
import { groupAutoCompleteState, isLoadingState } from "../../store/atom";
import Title from "../../components/Manager/Table/Title";
import { StyledLayout } from "./style/StyledLatout";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";
import { useQueries } from "react-query";
import LoadingLayout from "../../components/Manager/Loading/LoadingLayout";

const SizedBox = styled(Box)({
  height: "50px",
});

export default function ManageGroup() {
  const [groupData, setGroupData] = useState();
  const [ungroupData, setUngroupData] = useState();
  const setGroupAutoCompleteState = useSetRecoilState(groupAutoCompleteState);
  const groupAutoCompleteConverter = (allGroup) => {
    return [
      ...allGroup.map((group) => {
        return { label: `group ${group.tag}` };
      }),
    ];
  };

  const results = useQueries([
    {
      queryKey: ["groups"],
      queryFn: readAllGroups,

      cacheTime: 5 * 60 * 1000,
      onSuccess: (data) => {
        setGroupData(data);
        setGroupAutoCompleteState(groupAutoCompleteConverter(data));
      },
    },
    {
      queryKey: ["ungroups"],
      queryFn: readUngroup,

      cacheTime: 5 * 60 * 1000,
      onSuccess: (data) => {
        setUngroupData(data);
      },
    },
  ]);

  return (
    <StyledLayout>
      <LoadingLayout results={results}>
        <SideBar />

        <Box sx={{ width: "100%" }}>
          <StyledTitleFlexBox>
            <Title text="매칭된 그룹 목록" />
          </StyledTitleFlexBox>

          {groupData && (
            <GroupTables
              data={groupData}
              accentColumnNum={-1}
              longWidthColumnNum={-1}
              type="group"
            />
          )}

          <SizedBox />

          <StyledTitleFlexBox>
            <Title text={"그룹 미배정 학생 목록"} />
          </StyledTitleFlexBox>
          {ungroupData && (
            <UnGroupTable
              data={ungroupData}
              accentColumnNum={-1}
              longWidthColumnNum={-1}
              type="group"
            />
          )}
        </Box>
      </LoadingLayout>
    </StyledLayout>
  );
}
