import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import {
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment } from "react";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useRecoilValue } from "recoil";
import { readReportDetail } from "../../apis/manager";
import { deleteReport } from "../../apis/report";
import SideBar from "../../components/Manager/SideBar";
import { roleState } from "../../store/atom";

import { motion } from "framer-motion";
import { useQuery } from "react-query";
import Title from "../../components/common/Title";
import { StyledLayout } from "./style/StyledLatout";

export default function ReportDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { id = null } = useParams();

  const role = useRecoilValue(roleState);

  const useUserReportDetailMatch = useMatch("/report/:id");
  if (id === null) {
    navigate(-1);
    return;
  }

  // TODO: 개선 필요
  // state 로 처리하는 걸 없애고 싶다..
  // 관리자는 접근 가능.
  // 회원은 자기 페이지만 접근 가능.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: reportData } = useQuery(
    ["report", id],
    () => (role === "ADMIN" ? readReportDetail(+id) : state),
    {
      enabled: !!id,
    }
  );

  console.log(reportData);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // TODO: 매니저가 접근했을 때는 파라메터로 state 자체를 넣어줘야 작동하던데... 이거 수정필요
      // 수정은 했는데 확인필요 (reportData.id 로 잘 수정한듯)
      deleteReport(reportData.id).then(() => {
        alert("성공적으로 삭제되었습니다.");
        navigate(-1);
      });
    }
  };
  const handleModify = async () => {
    navigate(`/report/modify/${reportData.id}`, { state: state });
  };

  return (
    <>
      {reportData && (
        <StyledLayout
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Box>{!useUserReportDetailMatch && <SideBar />}</Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              gap: "20px",
              width: "100%",
            }}
          >
            <IconButton
              sx={{ position: "absolute", left: "0px", top: "0px" }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Title text={"보고서 상세 페이지"} />
            </Box>

            <Box
              sx={{
                border: 1,
                backgroundColor: "primary.default",
                borderColor: "primary.main",
                borderRadius: "30px",
                width: "100%",
                padding: "40px 40px",
              }}
            >
              <>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",

                      mb: "1rem",
                      position: "relative",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ minWidth: "100px", color: "text.secondary" }}>
                      제목
                    </Box>
                    <Typography
                      sx={{
                        flex: "10 1 auto",
                        marginLeft: "10px",
                        minWidth: "150px",
                      }}
                    >
                      {reportData.title}
                    </Typography>
                    {useUserReportDetailMatch && (
                      <IconButton onClick={handleModify}>
                        <DriveFileRenameOutlineIcon color="primary" />
                      </IconButton>
                    )}

                    <IconButton>
                      <DeleteIcon onClick={handleDelete} color="error" />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",

                      mb: "1rem",
                    }}
                  >
                    <Box sx={{ minWidth: "100px", color: "text.secondary" }}>
                      참여 멤버
                    </Box>
                    <Typography sx={{ flex: "10 1 auto", marginLeft: "10px" }}>
                      {reportData?.participants?.map((member, index) => (
                        <Fragment key={index}>
                          {index > 0 && ", "}
                          {member.name}
                        </Fragment>
                      ))}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",

                      mb: "1rem",
                    }}
                  >
                    <Box sx={{ minWidth: "100px", color: "text.secondary" }}>
                      스터디 과목
                    </Box>
                    <Typography sx={{ flex: "10 1 auto", marginLeft: "10px" }}>
                      {reportData?.courses?.map((course, index) => (
                        <Fragment key={index}>
                          {index > 0 && ", "}
                          {course.name}
                        </Fragment>
                      ))}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",

                      mb: "1rem",
                    }}
                  >
                    <Box sx={{ minWidth: "100px", color: "text.secondary" }}>
                      스터디 시간
                    </Box>
                    <Typography sx={{ flex: "10 1 auto", marginLeft: "10px" }}>
                      {reportData.totalMinutes}분
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",

                      mb: "1rem",
                    }}
                  >
                    <Box sx={{ minWidth: "100px", color: "text.secondary" }}>
                      보고서 내용
                    </Box>
                    <Typography sx={{ flex: "10 1 auto", marginLeft: "10px" }}>
                      {reportData.content}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: "100px", color: "text.secondary" }}>
                    인증 사진
                  </Box>
                  <Box
                    sx={{
                      display: "flex",

                      width: "100%",
                      my: "1rem",
                    }}
                  >
                    <ImageList>
                      {reportData.images?.map((item) => (
                        <ImageListItem key={item.id}>
                          <img src={item.url} alt="보고서 사진" />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                </Box>
              </>
            </Box>
          </Box>
        </StyledLayout>
      )}
    </>
  );
}
