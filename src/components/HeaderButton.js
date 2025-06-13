import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export default function HeaderButton({ link, name, match, color }) {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Button sx={{ color: color }}>{name}</Button>
        {match && (
          <Box
            component={motion.div}
            layoutId="nav"
            layout
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              mx: "auto",
              width: "10px",
              height: "10px",
              borderRadius: "100%",
              backgroundColor: `${color ? color : "primary.main"}`,
            }}
          ></Box>
        )}
      </Box>
    </Link>
  );
}
