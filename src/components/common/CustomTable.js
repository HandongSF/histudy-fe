import { Box, Button, Typography, styled } from "@mui/material";
import { Link } from "react-router-dom";
import UpDownButton from "./UpDownButton";
import AddDeleteButton from "./AddDeleteButton";

const maskingData = (type, idx, data) => {
  if (type === "first") {
    if (idx === 1) {
      return data.slice(0, 3) + "****" + data.slice(-1);
    } else if (idx === 2) {
      const [localPart, domainPart] = data.split("@");
      const maskedLocalPart = "*".repeat(localPart.length);
      return `${maskedLocalPart}@${domainPart}`;
    }
  }
  return data;
};

const StyledCustomTableContainer = styled(Box)(({ theme }) => ({
  py: "5px",
  backgroundColor: theme.palette.primary.lighter,
  borderColor: theme.palette.primary.border,
  borderRadius: "45px",
  maxHeight: "400px",
  minWidth: "900px",
  overflowY: "scroll",
}));

const StyledHeaderContainer = styled(Box)(({ theme, $dataLength }) => ({
  color: theme.palette.text.secondary,
  display: "flex",
  borderBottom: $dataLength !== 0 ? "1px solid" : "none",
  borderColor: theme.palette.primary.border,
  padding: "20px 60px",
  justifyContent: "start",
}));

const StyledRowContainer = styled(Box)(({ theme, index }) => ({
  position: "relative",
  alignItems: "center",
  margin: "0px 60px",
  display: "flex",
  borderTop: index !== 0 && "1px solid",
  padding: "20px 0px",
  borderColor: theme.palette.primary.border,
}));

const StyledOptionBox = styled(Box)({
  position: "absolute",
  right: 0,
});

const StyledTypo = styled(Typography)(
  ({ accentColumnNum, idxConverter, idx, longWidthColumnNum }) => ({
    width: longWidthColumnNum === idxConverter(idx + 1) ? "300px" : "180px",
    color: accentColumnNum === idxConverter(idx + 1) && "primary.main",
    fontWeight: accentColumnNum === idxConverter(idx + 1) && "bold",
  })
);

const FieldBoxWithProps = styled(Typography)(
  ({ idx, longWidthColumnNum, idxConverter, type }) => ({
    minWidth:
      longWidthColumnNum === idxConverter(type === "third" ? idx : idx + 1)
        ? "300px"
        : "180px",
  })
);

const FieldBox = styled(Typography)({
  minWidth: "180px",
});
//type에 따라 버튼 다르게 생기게
export default function CustomTable({
  reportData,
  sidebarValues = [],
  type,
  accentColumnNum,
  longWidthColumnNum,
  data,
  addData,
}) {
  const TableHead = {
    rank: [
      "순위",
      "그룹",
      "보고서 수",
      "누적 스터디 시간",
      "하루 평균 스터디 시간",
    ],
    first: ["이름", "학번", "이메일", ""],
    second: ["과목명", "과목코드", "담당 교수"],
    third: ["우선순위", "과목명", "과목코드", "담당 교수"],
    report: ["No.", "제목", "스터디 시간(분)", "작성일"],
    group: ["이름", "학번", "이메일"],
  };

  const idxConverter = (idx) => {
    if (type === "third" || type === "report") {
      return idx + 1;
    }
    return idx;
  };

  return (
    <StyledCustomTableContainer>
      <StyledHeaderContainer $dataLength={data.length}>
        {TableHead[type].map((headElement, index) => (
          <FieldBoxWithProps
            type={type}
            idx={index}
            idxConverter={idxConverter}
            longWidthColumnNum={longWidthColumnNum}
            key={index}
          >
            {headElement}
          </FieldBoxWithProps>
        ))}
      </StyledHeaderContainer>
      {data.map((row, index) => (
        <StyledRowContainer key={index} index={index}>
          {(type === "third" || type === "report") && (
            <FieldBox>{index + 1}</FieldBox>
          )}
          {row.map(
            (elem, idx) =>
              idx < 3 && (
                <StyledTypo
                  key={idx}
                  type={type}
                  accentColumnNum={accentColumnNum}
                  longWidthColumnNum={longWidthColumnNum}
                  idxConverter={idxConverter}
                  idx={idx}
                >
                  {maskingData(type, idx, elem)}
                </StyledTypo>
              )
          )}
          {/* 상세보기 */}
          {type === "report" && (
            <Link
              to={`/report/${reportData[index].id}`}
              state={reportData[index]}
            >
              <Button
                variant="outlined"
                sx={{ py: "3px", whiteSpace: "nowrap" }}
              >
                상세보기
              </Button>
            </Link>
          )}
          <StyledOptionBox>
            {type === "first" || type === "second" ? (
              <AddDeleteButton
                row={row}
                index={index}
                addData={addData}
                sidebarValues={sidebarValues}
                type={type}
              />
            ) : (
              type === "third" && (
                <UpDownButton index={index} addData={addData} data={data} />
              )
            )}
          </StyledOptionBox>
        </StyledRowContainer>
      ))}
    </StyledCustomTableContainer>
  );
}
