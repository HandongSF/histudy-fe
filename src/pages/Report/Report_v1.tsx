import { Box, styled } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getMyTeamReport } from "../../apis/report";
import CustomTable from "../../components/common/CustomTable";
import LongButton from "../../components/common/LongButton";
import NoDataLottie from "../../components/common/NoDataLottie";
import { StyledColumnAlignLayout } from "../../components/common/StyledLayout";
import Title from "../../components/common/Title";

const StyledScrollTableSize = styled(Box)({
  width: "90%",
  maxWidth: "900px",
  overflow: "scroll",
});

const StyleButtonBox = styled(Box)({
  width: "90%",
  maxWidth: "900px",
  display: "flex",
  justifyContent: "end",
  marginBottom: "2rem",
});

const dateConverter = (regDate) => {
  const date = new Date(regDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export default function Report() {
  const [reports, setReports] = useState([]);
  const [convertedReports, setConvertedReports] = useState([]);

  const { isLoading } = useQuery(["courses"], getMyTeamReport, {
    casheTime: 1 * 30 * 1000,
    onSuccess: (data) => {
      setReports(data.reports);
      setConvertedReports(
        data.reports.map((report) => [
          report.title,
          report.totalMinutes,
          dateConverter(report.regDate),
        ])
      );
    },
  });

  return (
    <>
      <StyledColumnAlignLayout
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Title text="제출한 보고서 목록" />
        <StyleButtonBox>
          <Link to="/add">
            <LongButton
              name="보고서 작성"
              bgColor="primary.main"
              fontColor="white"
            />
          </Link>
        </StyleButtonBox>
        <StyledScrollTableSize>
          <CustomTable
            data={convertedReports}
            reportData={reports}
            accentColumnNum={1}
            longWidthColumnNum={-1}
            type="report"
          />
          {reports.length === 0 && (
            <Box sx={{ mt: 5 }}>
              <NoDataLottie />
            </Box>
          )}
        </StyledScrollTableSize>
      </StyledColumnAlignLayout>
    </>
  );
}
