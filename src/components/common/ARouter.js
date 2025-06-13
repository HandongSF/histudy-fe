import { BrowserRouter, Route, Routes } from "react-router-dom";
import Enroll from "../../pages/Enroll/Enroll";
import Group from "../../pages/Group/Group";
import Main from "../../pages/Main/Main";
import Post from "../../pages/Post/Post";
import Rank from "../../pages/Rank/Rank";
import Report from "../../pages/Report/Report";
import Footer from "./Footer";
import Header from "./Header";
import ManageGroup from "../../pages/Manager/ManageGroup";
import ManageClass from "../../pages/Manager/ManageClass";
import StudyGroup from "../../pages/Manager/StudyGroup";
import ManageStudent from "../../pages/Manager/ManageStudent";
import ManageReport from "../../pages/Manager/ManageReport";
import ReportDetail from "../../pages/Manager/ReportDetail";
import CreateGroup from "../../pages/Manager/CreateGroup";
import Snackbars from "../../pages/Manager/Snackbars";
import { useRecoilState, useRecoilValue } from "recoil";
import { isDelete, isLoadingState } from "../../store/atom";
import Profile from "../../pages/Profile/Profile";
import LoadingLottie from "./LoadingLottie";
import PrivateRoute from "../../auth/PrivateRoute";
import MainImage from "../Main/MainImage";
import { Box, styled } from "@mui/material";

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
        </Routes>
        <Footer />
      </BrowserRouter>
    </MinWidthLayout>
  );
}
