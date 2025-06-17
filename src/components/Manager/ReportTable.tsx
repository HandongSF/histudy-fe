import { paths } from "@/const/paths";
import { Box, Chip, Typography } from "@mui/material";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

export default function ReportTable({
  type,
  accentColumnNum,
  longWidthColumnNum,
  data,
}) {
  const TableHead = {
    report: ["No.", "제목", "작성일", "스터디 시간"],
  };

  const navigate = useNavigate();
  const clickReport = (index) => {
    navigate(paths.reports.oneReport(index));
  };
  const handleDeleteRow = (index) => {};
  // useEffect(() => {
  //   const dateObj = new Date(data.regDate);
  //   const year = dateObj.getFullYear();
  //   const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  //   const day = String(dateObj.getDate()).padStart(2, "0");

  //   // const formattedDate = `year}-${month}-${day}`;
  //   console.log(year);
  //   console.log(month);
  //   console.log(day);
  //   // console.log(formattedDate);
  // }, []);
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box
        sx={{
          py: "5px",
          border: 1,
          backgroundColor: "primary.default",
          height: "60px",
          borderColor: "primary.main",
          borderRadius: "45px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 20px",
        }}
      >
        <span>Group {data.tag}</span>
        {"   "}
        <span>
          {data.members.map((member, index) => (
            <Fragment key={index}>
              {index > 0 && ", "}
              {member.name}
            </Fragment>
          ))}
        </span>
        <span>총 스터디 시간 {data.totalTime}분</span>
      </Box>

      <Box
        sx={{
          py: "5px",
          border: 1,
          backgroundColor: "primary.default",
          borderColor: "primary.main",
          borderRadius: "45px",
        }}
      >
        <Box
          sx={{
            color: "text.secondary",
            display: "flex",
            py: "20px",
            borderBottom: data.reports.length !== 0 && 1,
            borderColor: "primary.main",
            px: "60px",
          }}
        >
          {TableHead[type].map((headElement, index) => (
            <Typography
              key={index}
              sx={{
                flexGrow: 1,
                width: longWidthColumnNum === index + 1 && "50%",
                minWidth: longWidthColumnNum !== index + 1 && "150px",
              }}
            >
              {headElement}
            </Typography>
          ))}
        </Box>
        {data.reports.map((row, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",

              borderTop: index !== 0 && 1,
              // py: "20px",
              borderColor: "primary.border",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  flexGrow: 1,
                  width: "50px",
                  textOverflow: "ellipsis",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  paddingLeft: "4rem",
                  py: "20px",
                  borderColor: "primary.border",
                }}
              >
                {row.id}
              </Box>
              <Box
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  flexGrow: 1,
                  width: "50px",
                  textOverflow: "ellipsis",
                  overflowX: "auto",
                  whiteSpace: "nowrap",

                  py: "20px",
                  borderColor: "primary.border",
                }}
              >
                {row.title}
              </Box>

              <Box
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  flexGrow: 1,
                  width: "50px",
                  textOverflow: "ellipsis",
                  overflowX: "auto",
                  whiteSpace: "nowrap",

                  py: "20px",
                  borderColor: "primary.border",
                }}
              >
                {row.regDate.split("T")[0]}
              </Box>
              <Box
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  flexGrow: 1,
                  width: "50px",
                  textOverflow: "ellipsis",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  py: "20px",
                  borderColor: "primary.border",
                }}
              >
                {row.totalMinutes}분
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "20px",
                }}
              >
                <Chip
                  label="상세 보기"
                  sx={{
                    backgroundColor: "primary.light",
                    color: "primary.main",
                  }}
                  onClick={() => {
                    clickReport(row.id);
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
