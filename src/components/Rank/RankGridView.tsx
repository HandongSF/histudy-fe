import { Box, styled, Grid, ImageList } from "@mui/material";
import HoverBox from "./HoverBox";
import Item from "./Item";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { useSetRecoilState } from "recoil";
import { roleState, isShowFullImageState } from "../../store/atom";
import { AnimatePresence } from "framer-motion";

const StyledItemSize = styled(Box)({
  position: "relative",
  width: "300px",
  height: "300px",
});

export default function RankGridView({
  setFullImageUrl,
  setItemsHover,
  teams,
  itemsHover,
}) {
  const setIsShowFullImage = useSetRecoilState(isShowFullImageState);
  const myRole = useRecoilValue(roleState);

  const handleFullImageOpen = async (imageUrl) => {
    if (myRole !== "ADMIN") return;
    if (!imageUrl) {
      setFullImageUrl("/img/mainImg2.png");
    } else setFullImageUrl(imageUrl);
    setIsShowFullImage(true);
  };

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

  return (
    <ImageList
      cols={4}
      gap={15}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {teams.map((item, index) => (
        <Grid
          item
          key={index}
          onClick={() => handleFullImageOpen(item?.thumbnail)}
        >
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
  );
}
