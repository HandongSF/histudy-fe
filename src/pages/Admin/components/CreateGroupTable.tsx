import { Cancel } from "@mui/icons-material";
import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { useSetRecoilState } from "recoil";
import { deleteUserForm } from "../../../apis/manager";
import { isLoadingState } from "../../../store/atom";

export default function CreateGroupTable({
  type,
  accentColumnNum,
  longWidthColumnNum,
  data,
}) {
  const fillThree = (num) => {
    let array = [];
    for (var i = 0; i < 3 - num; ++i) {
      array.push("");
    }
    return array;
  };
  const TableHead = {
    all: [
      "학생 정보",
      "희망 1과목",
      "희망 2과목",
      "희망 3과목",
      "함께하고 싶은 친구",
      "삭제",
    ],
  };

  const setIsLoading = useSetRecoilState(isLoadingState);
  const handleDeleteRow = (sid) => {
    deleteUserForm(sid);
    setIsLoading(true);
    window.location.reload();
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box
        sx={{
          maxHeight: "60vh",
          overflow: "scroll",
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
            justifyContent: "space-between",
            py: "20px",

            borderColor: "primary.main",
            px: "60px",
          }}
        >
          {TableHead[type].map((headElement, index) => (
            <Typography
              key={index}
              sx={
                {
                  // flexGrow: 1,
                  // width: longWidthColumnNum === index + 1 && "50%",
                  // minWidth: longWidthColumnNum !== index + 1 && "150px",
                }
              }
            >
              {headElement}
            </Typography>
          ))}
        </Box>
        {data.map((row, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: "50px",
              borderTop: index !== 0 && 1,
              borderColor: "primary.border",
            }}
          >
            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            > */}
            <Select
              sx={{
                minWidth: "100px",
                color: "text.secondary",
                display: "flex",
                borderColor: "primary.border",
              }}
              defaultValue={10}
            >
              <MenuItem value={10}>{row.name}</MenuItem>
              <MenuItem value={20}>{row.sid}</MenuItem>
              <MenuItem value={30}>{row.email}</MenuItem>
            </Select>

            {/* <Box
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  py: "20px",
                  borderColor: "primary.border",
                  gap: "30px",
                }}
              > */}
            {/* <Select
                  sx={{ width: "170px", color: "text.secondary" }}
                  value={row.courses.length > 0 ? row.courses[0].name : ""}
                >
                  {row.courses.map((subject, index) => (
                    <MenuItem key={index} value={subject.name}>
                      <Typography>{subject.name}</Typography>
                    </MenuItem>
                  ))}
                </Select> */}
            {row.courses.map((subject, index) => (
              <Box
                sx={{
                  minWidth: "80px",
                }}
              >
                {subject.name} ({subject.prof})
              </Box>
            ))}
            {fillThree(row.courses.length).map((subject, index) => (
              <Box
                sx={{
                  minWidth: "80px",
                }}
              >
                {subject}
              </Box>
            ))}
            {/* </Box> */}

            <Box
              sx={{
                color: "text.secondary",
                display: "flex",
                py: "20px",
                ml: "10px",
                borderColor: "primary.border",
              }}
            >
              <Select
                sx={{ width: "150px", color: "text.secondary" }}
                value={row.friends.length > 0 ? row.friends[0].name : ""}
              >
                {row.friends.map((friend, index) => (
                  <MenuItem key={index} value={friend.name}>
                    <Typography>
                      {friend.name}, {friend.sid}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Box>
            {/* </Box> */}
            <IconButton onClick={() => handleDeleteRow(row.sid)}>
              <Cancel />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
