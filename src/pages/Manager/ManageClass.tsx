import { Box } from "@mui/system";
import { useState } from "react";
import { useQuery } from "react-query";
import { searchCourses } from "../../apis/course";
import LoadingLayout from "../../components/Manager/Loading/LoadingLayout";
import ManagerTable from "../../components/Manager/ManagerTable";
import RegisterClassButton from "../../components/Manager/RegisterClassButton";
import Title from "../../components/Manager/Table/Title";
import { StyledLayout } from "./style/StyledLatout";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";

export default function ManageClass() {
  const [classData, setClassData] = useState();

  const { isLoading } = useQuery(["courses"], () => searchCourses(""), {
    cacheTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      setClassData(data.courses);
    },
  });

  return (
    <StyledLayout>
      <LoadingLayout isLoading={isLoading}>
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
