import { IconButton, ImageListItem, ImageListItemBar } from "@mui/material";
import { motion } from "framer-motion";
import GroupsIcon from "@mui/icons-material/Groups";

export default function Item({ item, itemsHover, index }) {
  return (
    <ImageListItem key={index} sx={{ position: "relative" }}>
      {!itemsHover[index] && (
        <motion.img
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={`${!item?.thumbnail ? "/img/mainImg2.png" : item?.thumbnail}`}
          alt={item?.title}
          loading="lazy"
          style={{ objectFit: "cover", height: "300px", width: "300px" }}
        />
      )}
      <ImageListItemBar
        sx={{
          color: "white",
          position: "absolute",
          top: !itemsHover[index] ? 250 : 30,
        }}
        title={` ${
          itemsHover[index] ? `Group ${item?.id}` : `Rank ${index + 1}`
        }`}
        actionIcon={
          <IconButton
            sx={{ color: "rgba(255, 255, 255, 1)" }}
            aria-label={`info about ${item?.title}`}
          >
            <GroupsIcon />
          </IconButton>
        }
      />
    </ImageListItem>
  );
}
