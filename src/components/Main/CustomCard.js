import { Box, Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styled from "styled-components";
import HeaderButton from "../common/HeaderButton";

export default function CustomCard({ width, title, icon, link }) {
  return (
    <Link to={`${link}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Box
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        component={motion.div}
        className=".grid-item"
        sx={{
          //   borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: width,
          height: "300px",
          // backgroundColor: "primary.lighter",
          // border: 3,
          borderColor: "primary.border",
          color: "ga",
          fontWeight: "bold",
        }}
        whileHover={{ scale: 1.1 }}
      >
        <Box sx={{ fontSize: "50px" }}>{icon}</Box>
        <Typography variant="body2" sx={{ fontSize: "30px" }}>
          {title}
        </Typography>
      </Box>
    </Link>
  );
}
