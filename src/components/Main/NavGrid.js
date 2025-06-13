import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import CustomCard from "./CustomCard";

import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
const CardGrid = styled(Grid)`
  display: flex;
  gap: 10px;
  width: 900px;
`;

const cards = [
  { icon: "아이콘1", text: "단어1" },
  { icon: "아이콘2", text: "단어2" },
  { icon: "아이콘3", text: "단어3" },
  { icon: "아이콘4", text: "단어4" },
  { icon: "아이콘5", text: "단어5" },
  { icon: "아이콘6", text: "단어6" },
];

const NavGrid = () => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: "10px", my: "50px" }}
    >
      <CardGrid sx={{ display: "flex", gap: "10px" }}>
        <CustomCard
          width={"300px"}
          title={"내 스터디 그룹"}
          link={"/group"}
          icon={<>👨‍👩‍👧‍👦</>}
        />
        <CustomCard
          width={"300px"}
          title={"보고서"}
          link={"/report"}
          icon={<>📑</>}
        />
        <CustomCard
          width={"300px"}
          title={"스터디 순위"}
          link={"/rank"}
          icon={<>🔥</>}
        />
      </CardGrid>
      <Box sx={{ display: "flex", gap: "10px" }}>
        <CustomCard
          width={"455px"}
          title={"스터디 신청하기"}
          link={"/enroll"}
          icon={<>✨</>}
        />
        <CustomCard
          width={"455px"}
          title={"관리자"}
          link={"/manageClass"}
          icon={<>👨‍💼</>}
        />
      </Box>
    </Box>
  );
};

export default NavGrid;
