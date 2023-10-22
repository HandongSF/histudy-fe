import { Grid, ImageList, styled } from "@mui/material";

import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getAllTeamsForRank } from "../../apis/rank";

import HoverBox from "../../components/Rank/HoverBox";
import { AnimatePresence, motion } from "framer-motion";

import NoDataLottie from "../../components/common/NoDataLottie";
import { StyledColumnAlignLayout } from "../../components/common/StyledLayout";
import Title from "../../components/common/Title";
import { useQuery } from "react-query";

import Item from "../../components/Rank/Item";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  authorityState,
  fullImageState,
  isShowFullImageState,
} from "../../store/atom";

const StyledScrollBox = styled(Box)({
  maxWidth: "1245px",
  width: "100%",
  overflow: "scroll",
});

const StyledItemSize = styled(Box)({
  position: "relative",
  width: "300px",
  height: "300px",
});

export default function Rank() {
  const [teams, setTeams] = useState([]);
  const [itemsHover, setItemsHover] = useState([]);

  const { isLoading } = useQuery(["AllTeamRanks"], getAllTeamsForRank, {
    casheTime: 10 * 60 * 1000,
    onSuccess: (data) => {
      setTeams(data.teams);
      setItemsHover(new Array(data.teams.length).fill(false));
    },
  });

  const handleMouseOver = (index) => {
    setItemsHover((prev) => [
      ...prev?.slice(0, index),
      true,
      ...prev?.slice(index + 1),
    ]);
  };
  const handleMouseOut = (index) => {
    setItemsHover((prev) => [
      ...prev?.slice(0, index),
      false,
      ...prev?.slice(index + 1),
    ]);
  };

  const setIsShowFullImage = useSetRecoilState(isShowFullImageState);
  const myAuthority = useRecoilValue(authorityState);

  const handleFullImageOpen = () => {
    if (myAuthority !== "ADMIN") return;
    setIsShowFullImage(true);
  };

  return (
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
          <ImageList
            cols={4}
            gap={15}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {teams.map((item, index) => (
              <Grid item key={index} onClick={handleFullImageOpen}>
                <StyledItemSize
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={() => handleMouseOut(index)}
                >
                  <AnimatePresence>
                    {itemsHover[index] && (
                      <HoverBox
                        members={item.members}
                        reports={item.reports}
                        totalMinutes={item.totalMinutes}
                      />
                    )}
                  </AnimatePresence>

                  <Item index={index} item={item} itemsHover={itemsHover} />
                </StyledItemSize>
              </Grid>
            ))}
          </ImageList>
        </StyledScrollBox>
      )}

      {/* </Grid> */}
    </StyledColumnAlignLayout>
  );
}
