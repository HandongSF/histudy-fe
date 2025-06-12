import { Edit } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { editUser } from "../../apis/manager";
import { isLoadingState } from "../../store/atom";
import GroupSelector from "./GroupSelector";

export default function UnGroupTable({
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
    group: [
      "그룹",
      "학생 정보",
      "희망 1과목",
      "희망 2과목",
      "희망 3과목",
      "함께하고 싶은 친구",
      "수정",
    ],
  };

  const [edit, setEdit] = useState([false]);

  const [team, setTeam] = useState(data.tag);
  const [sid, setSid] = useState();

  // const handleSave = (index) => {
  //   const newData = {
  //     team: team,
  //     id: id,
  //   };
  //   editUser();
  //   alert("저장되었습니다!");
  // };
  const handleDeleteRow = (index) => {};

  const handleEdit = (index) => {
    const newEdit = [...edit];
    newEdit[index] = !newEdit[index];
    setEdit(newEdit);
  };
  const setIsLoading = useSetRecoilState(isLoadingState);

  return (
    <>
      <Box
        sx={{
          minWidth: "1000px",
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
            borderBottom: 1,
            borderColor: "primary.main",
            px: "50px",
          }}
        >
          {TableHead[type].map((headElement, index) => (
            <Typography
              key={index}
              sx={
                {
                  // flexGrow: 1,
                  // width: longWidthColumnNum === index + 1 && "50%",
                  // minWidth: "150px",
                }
              }
            >
              {headElement}
            </Typography>
          ))}
        </Box>
        {data.map((row, index) => (
          <>
            {!edit[index] ? (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  px: "50px",
                  gap: "10px",
                  justifyContent: "space-between",
                  borderTop: index !== 0 && 1,
                  alignItems: "center",
                  borderColor: "primary.border",
                }}
              >
                <Box
                  sx={{
                    color: "text.secondary",
                    borderColor: "primary.border",
                  }}
                >
                  미배정
                </Box>

                <Select
                  sx={{
                    minWidth: "100px",
                    color: "text.secondary",
                    display: "flex",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
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
                      
                      flexGrow: 1,
                      marginLeft: "20px",
                      py: "20px",
                      borderColor: "primary.border",
                      // gap: "20px",
                    }}
                  > */}
                {row.courses.map((subject, index) => (
                  <Box
                    sx={{
                      width: "120px",
                    }}
                  >
                    {subject.name} ({subject.prof})
                  </Box>
                ))}
                {fillThree(row.courses.length).map((subject, index) => (
                  <Box
                    sx={{
                      width: "120px",
                    }}
                  >
                    {subject}
                  </Box>
                ))}
                {/* </Box> */}

                {/* <Box
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    flexGrow: 1,
                    py: "20px",
                    borderColor: "primary.border",
                  }}
                > */}
                <Select
                  sx={{ color: "text.secondary", width: "150px" }}
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
                {/* </Box> */}
                {/* </Box> */}

                <Box sx={{ py: "25px" }}>
                  <IconButton
                    onClick={() => {
                      handleEdit(index);
                    }}
                  >
                    <Edit />
                  </IconButton>

                  {/* <IconButton onClick={() => handleDeleteRow(index)}>
                    <Cancel />
                  </IconButton> */}
                </Box>
              </Box>
            ) : (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  borderTop: index !== 0 && 1,
                  borderColor: "primary.border",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexGrow: 1,
                    px: "30px",
                  }}
                >
                  <Box
                    sx={{
                      color: "text.secondary",
                      display: "flex",
                      flexGrow: 1,
                      borderColor: "primary.border",
                    }}
                  >
                    <GroupSelector setTeam={setTeam} />
                  </Box>

                  <Select
                    sx={{
                      minWidth: "80px",
                      color: "text.secondary",
                      display: "flex",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",

                      borderColor: "primary.border",
                    }}
                    defaultValue={10}
                  >
                    <MenuItem value={10}>{row.name}</MenuItem>
                    <MenuItem value={20}>{row.sid}</MenuItem>
                    <MenuItem value={30}>{row.email}</MenuItem>
                  </Select>

                  <Box
                    sx={{
                      color: "text.secondary",
                      display: "flex",
                      flexGrow: 1,
                      marginLeft: "40px",

                      py: "20px",
                      // width: "10px",
                      borderColor: "primary.border",
                      gap: "20px",
                    }}
                  >
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
                      <Typography
                        sx={{
                          width: "120px",
                        }}
                      >
                        {subject.name} ({subject.prof})
                      </Typography>
                    ))}
                    {fillThree(row.courses.length).map((subject, index) => (
                      <Typography
                        sx={{
                          width: "120px",
                        }}
                      >
                        {subject}
                      </Typography>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      color: "text.secondary",
                      display: "flex",
                      flexGrow: 1,
                      marginLeft: "-40px",
                      marginRight: "-40px",
                      py: "20px",
                      borderColor: "primary.border",
                    }}
                  >
                    <Select
                      sx={{ width: "140px", color: "text.secondary" }}
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
                </Box>

                <Box sx={{ display: "flex", py: "30px", marginRight: "5px" }}>
                  <Chip
                    sx={{
                      color: "white",
                      backgroundColor: "primary.main",
                    }}
                    onClick={() => {
                      const newData = {
                        team: Number(team),
                        sid: !sid ? row.sid : sid,
                        name: row.name,
                        id: row.id,
                      };

                      editUser(newData)
                        .then((res) => {
                          alert("변경되었습니다!");
                          window.location.reload();
                        })
                        .catch((err) => {
                          alert("변경에 실패했습니다!");
                        });
                    }}
                    label="저장"
                  />{" "}
                  <Chip
                    sx={{
                      marginLeft: "0.5rem",
                      color: "#FF0000",
                      backgroundColor: "#FFE4E4",
                    }}
                    onClick={() => handleEdit(index)}
                    label="취소"
                  />
                </Box>
              </Box>
            )}
          </>
        ))}
      </Box>
    </>
  );
}
