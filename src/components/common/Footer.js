import { Box, Typography, useTheme } from "@mui/material";
import ExportCSV from "../scv/ExportCSV";
import { useMatch } from "react-router-dom";

export default function Footer() {
  const mainMatch = useMatch("/");

  const theme = useTheme();
  return (
    <>
      {mainMatch ? (
        <Box></Box>
      ) : (
        <Box
          sx={{
            height: "80px",
            px: "50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: 1,
            borderColor: "primary.border",
            backgroundColor: "primary.lighter",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: {
                md: "space-between",
                sm: "center",
                xs: "center",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src="./img/logo_histudy.png" width={120} />
              <Typography
                variant="caption"
                sx={{ mx: { md: 5, sm: 2, xs: 2 }, whiteSpace: "nowrap" }}
              >
                <strong>ⓒ </strong> 2023 SWTeam5. All rights reserved.
              </Typography>
            </Box>
            <Box
              sx={{
                display: { md: "flex", sm: "none", xs: "none" },
                flexDirection: "column",
              }}
            >
              <Typography variant="body2">
                <strong
                  style={{
                    fontSize: "18px",
                    marginRight: "10px",
                    color: theme.palette.primary.main,
                  }}
                >
                  Developer
                </strong>{" "}
                김진수 , 배주영 , 오인혁 , 이인혁 , 한시온
              </Typography>
              <Typography variant="body2">
                {" "}
                <strong
                  style={{
                    fontSize: "18px",
                    marginRight: "10px",
                    color: theme.palette.primary.main,
                  }}
                >
                  Designer
                </strong>{" "}
                강이경
              </Typography>
            </Box>
          </Box>

          {/* <ExportCSV /> */}
        </Box>
      )}
    </>
  );
}
