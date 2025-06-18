import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { readGroupReport } from "../../apis/manager";
import ReportTable from "../../components/Manager/ReportTable";

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

  const [friendInput, setFriendInput] = useState("");
  const handleChange = (event) => {
    setFriendInput(event.target.value);
  };
  const navigate = useNavigate();

  const moveToBefore = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ display: "flex", py: "50px", gap: "50px", px: "50px" }}>
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
