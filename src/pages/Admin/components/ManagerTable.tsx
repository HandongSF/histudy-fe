import { Box, Typography } from "@mui/material";
import { deleteCourse } from "../../../apis/manager";

export default function ManagerTable({
  type,
  accentColumnNum,
  longWidthColumnNum,
  data,
}) {
  const TableHead = {
    class: ["과목명", "과목코드", "담당 교수"],
    group: ["그룹", "멤버", "희망과목", "함께하고 싶은 친구"],
  };

  const handleDeleteRow = (index) => {
    console.log("index");
    console.log(index);
    console.log(deleteCourse(index));
  };
  return (
    <>
      <Box
        sx={{
          overflow: "scroll",
          maxHeight: "60vh",
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
        {data.map((row, index) => (
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
                color: "text.secondary",
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
                  marginLeft: "2rem",
                  py: "20px",
                  borderColor: "primary.border",
                }}
              >
                {row.name}
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
                {row.code}
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
                {row.prof}
              </Box>
            </Box>
            {/* <IconButton
              onClick={() => handleDeleteRow(row.id)}
              sx={{
                marginRight: "1rem",
              }}
            >
              <Cancel />
            </IconButton> */}
          </Box>
        ))}
      </Box>
    </>
  );
}
