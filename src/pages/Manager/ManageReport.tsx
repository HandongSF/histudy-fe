import { IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import SideBar from "../../components/Manager/SideBar";
import ReportTable from "../../components/Manager/ReportTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { readGroupReport } from "../../apis/manager";

export default function ManageReport() {
  const { state } = useLocation();

  const [reportData, setReportData] = useState();

  useEffect(() => {
    if (state) {
      readGroupReport(state).then((data) => {
        setReportData(data);
      });
    }
  }, []);
  // const reportData = {
  //   group: 1,
  //   members: [
  //     { id: 1, name: "한시온" },
  //     { id: 2, name: "오인혁" },
  //     { id: 3, name: "장유진" },
  //     { id: 4, name: "강이경" },
  //   ],
  //   totalTime: 600,
  //   reports: [
  //     {
  //       id: 1,
  //       title: "알고리듬 분석 스터디1",
  //       writer: "한시온",
  //       regDate: "2023.04.15",
  //       time: 120,
  //     },
  //     {
  //       id: 2,
  //       title: "보고서 1",
  //       writer: "한시온",
  //       regDate: "2023.04.15",
  //       time: 120,
  //     },
  //     {
  //       id: 3,
  //       title: "보고서 2",
  //       writer: "한시온",
  //       regDate: "2023.04.15",
  //       time: 120,
  //     },
  //     {
  //       id: 4,
  //       title: "보고서 3",
  //       writer: "한시온",
  //       regDate: "2023.04.15",
  //       time: 120,
  //     },
  //     {
  //       id: 5,
  //       title: "보고서 4",
  //       writer: "한시온",
  //       regDate: "2023.04.15",
  //       time: 120,
  //     },
  //   ],
  // };

  const [friendInput, setFriendInput] = useState("");
  const handleChange = (event) => {
    setFriendInput(event.target.value);
  };
  const navigate = useNavigate();

  const moveToBefore = () => {
    navigate(-1);
  };
  const clickReport = (index) => {
    navigate("/reportDetail", { state: index });
  };
  return (
    <Box sx={{ display: "flex", py: "50px", gap: "50px", px: "50px" }}>
      <Box sx={{}}>
        <SideBar />
      </Box>
      <Box sx={{ width: "100%" }}>
        <>
          <Box sx={{ display: "flex", mb: "3rem" }}>
            <IconButton onClick={() => moveToBefore()}>
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: "1rem",
            }}
          ></Box>
          {reportData && (
            <ReportTable
              data={reportData}
              accentColumnNum={-1}
              longWidthColumnNum={-1}
              type="report"
            />
          )}
        </>
      </Box>
    </Box>
  );
}
