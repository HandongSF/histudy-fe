import { Box } from "@mui/system";
import { useState } from "react";
import { useQuery } from "react-query";
import { searchCourses } from "../../apis/course";

import { StyledLayout } from "./style/StyledLatout";
import { StyledTitleFlexBox } from "./style/StyledTitleFlexBox";
import RegisterClassButton from "./components/RegisterClassButton";
import LoadingLayout from "./components/Loading/LoadingLayout";
import Title from "./components/Table/Title";
import ManagerTable from "./components/ManagerTable";

export default function ManageClassPage() {
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
