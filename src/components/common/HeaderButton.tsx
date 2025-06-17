import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { paths } from "@/const/paths";
export default function HeaderButton({ link, name, match, color }) {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Button
          sx={{
            color: color,
            whiteSpace: "nowrap",
            minWidth: link === paths.root && "100px",
            fontSize: { md: "15px", sm: "12px", xs: "12px" },
          }}
        >
          {name}
        </Button>
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
              width: { md: "10px", sm: "7px", xs: "7px" },
              height: { md: "10px", sm: "7px", xs: "7px" },
              borderRadius: "100%",
              backgroundColor: `${color ? color : "primary.main"}`,
            }}
          ></Box>
        )}
      </Box>
    </Link>
  );
}
