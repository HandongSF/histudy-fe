import { styled } from "@mui/material";

import { Box } from "@mui/system";
import { useState } from "react";
import { getAllTeamsForRank } from "../../apis/rank";

import { motion } from "framer-motion";

import { useQuery } from "react-query";
import NoDataLottie from "../../components/common/NoDataLottie";
import { StyledColumnAlignLayout } from "../../components/common/StyledLayout";
import Title from "../../components/common/Title";

import FullImage from "../../components/Rank/FullImage";

import RankGridView from "../../components/Rank/RankGridView";
import RankListView from "../../components/Rank/RankListView";
import ViewToggleButton from "../../components/Rank/ViewToggleButton";

const StyledScrollBox = styled(Box)({
  maxWidth: "1280px",
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
});

export default function Rank() {
  const [teams, setTeams] = useState([]);
  const [itemsHover, setItemsHover] = useState([]);
  const [view, setView] = useState("list");

  useQuery(["AllTeamRanks"], getAllTeamsForRank, {
    casheTime: 10 * 60 * 1000,
    onSuccess: (data) => {
      setTeams(data.teams);
      setItemsHover(new Array(data.teams.length).fill(false));
    },
    refetchOnWindowFocus: false,
  });

  const [fullImageUrl, setFullImageUrl] = useState(null);

  return (
    <>
      <FullImage fullImageUrl={fullImageUrl} />
      <StyledColumnAlignLayout
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Title text="스터디 그룹 랭킹" />

        {teams.length === 0 ? (
          <NoDataLottie />
        ) : (
          <StyledScrollBox>
            <ViewToggleButton view={view} setView={setView} />
            <Box height="20px" />
            {view === "list" ? (
              <RankListView teams={teams} />
            ) : (
              <RankGridView
                setFullImageUrl={setFullImageUrl}
                setItemsHover={setItemsHover}
                teams={teams}
                itemsHover={itemsHover}
              />
            )}
          </StyledScrollBox>
        )}

        {/* </Grid> */}
      </StyledColumnAlignLayout>
    </>
  );
}
