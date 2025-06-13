import { Box, styled } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import PrivateRoute from "../../auth/PrivateRoute";
import Enroll from "../../pages/Enroll/Enroll";
import Group from "../../pages/Group/Group";
import Main from "../../pages/Main/Main";
import CreateGroup from "../../pages/Manager/CreateGroup";
import ManageClass from "../../pages/Manager/ManageClass";
import ManageGroup from "../../pages/Manager/ManageGroup";
import ManageReport from "../../pages/Manager/ManageReport";
import ManageStudent from "../../pages/Manager/ManageStudent";
import ReportDetail from "../../pages/Manager/ReportDetail";
import Snackbars from "../../pages/Manager/Snackbars";
import StudyGroup from "../../pages/Manager/StudyGroup";
import Post from "../../pages/Post/Post";
import Profile from "../../pages/Profile/Profile";
import Rank from "../../pages/Rank/Rank";
import Report from "../../pages/Report/Report";
import { isDelete, isLoadingState } from "../../store/atom";
import MainImage from "../Main/MainImage";
import Footer from "./Footer";
import Header from "./Header";
import LoadingLottie from "./LoadingLottie";

const MinWidthLayout = styled(Box)({
  minWidth: "450px",
});
export default function ARouter() {
  const isLoading = useRecoilValue(isLoadingState);
  const [open, setOpen] = useRecoilState(isDelete);
  return (
    <MinWidthLayout>
      <BrowserRouter sx={{ position: "relative" }}>
        <Header />

        {isLoading && <LoadingLottie />}
        <Snackbars open={open} setOpen={setOpen} />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/post" element={<Post />}></Route>
          <Route path="/rank" element={<Rank />}></Route>
          <Route
            path="/enroll"
            element={<PrivateRoute component={<Enroll />} />}
          ></Route>
          <Route
            path="/group"
            element={<PrivateRoute component={<Group />} />}
          ></Route>
          <Route
            path="/report"
            element={<PrivateRoute component={<Report />} />}
          ></Route>
          <Route path="/report/:id" element={<ReportDetail />}></Route>
          <Route path="/report/modify/:id" element={<Post />}></Route>
          <Route path="/add" element={<Post />}></Route>

          <Route
            path="/manageClass"
            element={<PrivateRoute component={<ManageClass />} />}
          ></Route>
          <Route path="/manageGroup" element={<ManageGroup />}></Route>
          <Route path="/studyGroup" element={<StudyGroup />}></Route>
          <Route path="/createGroup" element={<CreateGroup />}></Route>
          <Route path="/manageStudent" element={<ManageStudent />}></Route>
          <Route path="/manageReport" element={<ManageReport />}></Route>

          <Route path="/reportDetail" element={<ReportDetail />}></Route>
          <Route path="/test" element={<MainImage />}></Route>
          <Route
            path="/profile"
            element={<PrivateRoute component={<Profile />} />}
          ></Route>
          {/* TODO: router 아무것도 접근 하지 못하면 404. 히즈스터디 다른 포트로 */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </MinWidthLayout>
  );
}
