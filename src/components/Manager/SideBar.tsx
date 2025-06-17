import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { selectState } from "../../store/atom";
import { paths } from "@/const/paths";

export default function SideBar() {
  // const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useRecoilState(selectState);

  const listItemButtonStyles = {
    "&:hover": {
      backgroundColor: "#F2F8FF",
      borderRadius: "13px",
    },
    "&.Mui-selected": {
      borderRadius: "13px",
    },
  };

  const handleClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <Box>
      <Box
        sx={{
          p: "30px",
          border: 2,
          borderRadius: "20px",
          width: "280px",
          mb: "15px",
          backgroundColor: "background.sidebar",
          borderColor: "lightGray",
          display: { md: "flex", sm: "none", xs: "none" },
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: "30px", ml: "15px" }}>
          관리자 페이지
        </Typography>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.sidebar",
          }}
          aria-label="contacts"
        >
          <ListItem disablePadding>
            <Link
              to={paths.admin.manageClass}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{ ...listItemButtonStyles }}
                onClick={() => handleClick(1)}
              >
                <ListItemText
                  style={{ color: selectedMenu === 1 && "#007AFF" }}
                  primary="현재 학기 수업 조회"
                />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              to={paths.admin.createGroup}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{ ...listItemButtonStyles }}
                onClick={() => handleClick(2)}
              >
                <ListItemText
                  style={{ color: selectedMenu === 2 && "#007AFF" }}
                  primary="스터디 그룹 생성"
                />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              to={paths.admin.manageGroup}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{ ...listItemButtonStyles }}
                onClick={() => handleClick(3)}
              >
                <ListItemText
                  style={{ color: selectedMenu === 3 && "#007AFF" }}
                  primary="그룹 매칭 관리"
                />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              to={paths.admin.manageStudy}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{ ...listItemButtonStyles }}
                onClick={() => handleClick(4)}
              >
                <ListItemText
                  style={{ color: selectedMenu === 4 && "#007AFF" }}
                  primary="그룹별 활동 조회"
                />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding>
            <Link
              to={paths.admin.manageStudent}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                sx={{ ...listItemButtonStyles }}
                onClick={() => handleClick(5)}
              >
                <ListItemText
                  style={{ color: selectedMenu === 5 && "#007AFF" }}
                  primary="스터디 신청자 정보 조회"
                />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
