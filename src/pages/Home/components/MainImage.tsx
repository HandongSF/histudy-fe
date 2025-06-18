import { Box, Button, Typography, styled } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { roleState } from "../../../store/atom";
import { paths } from "@/const/paths";

const StyledContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
});

const StyledGradient = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1))",
  zIndex: 10,
  width: "100%",
  minHeight: "100%",
  height: "100vh",
});

const StyledImage = styled(Box)({
  zIndex: 0,
  objectFit: "cover",
  width: "100%",
});

const StyledTextContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "0",
  zIndex: "30",
  color: "white",
  alignItems: "center",
  width: "100%",
});

const StyledFirstTypo = styled(Typography)({
  "@media (max-width: 600px)": {
    fontSize: "60px",
  },
  fontSize: "80px",
  marginTop: "200px",
  fontWeight: "300",
  textAlign: "center",
});

const StyledSecondTypo = styled(Typography)({
  "@media (max-width: 600px)": {
    fontSize: "30px",
  },
  fontSize: "40px",
  marginTop: "100px",
  fontWeight: "300",
  textAlign: "center",
});

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: "50px",
  borderRadius: "50px",
  fontSize: "20px",
  padding: "10px 30px", // 합쳐진 px와 py
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
}));

export default function MainImage() {
  const role = useRecoilValue(roleState);
  const mainButtonReturner = (type: "link" | "text") => {
    if (type === "link") {
      switch (role) {
        case "NONUSER":
          return paths.ranks.root;
        case "USER":
          return paths.application.root;
        case "MEMBER":
          return paths.myGroup.root;
        case "ADMIN":
          return paths.admin.manageClass;
      }
    } else if (type === "text") {
      switch (role) {
        case "NONUSER":
          return "Look Around";
        case "USER":
          return "Apply Study";
        case "MEMBER":
          return "My Study";
        case "ADMIN":
          return "Manage Study";
      }
    }
  };

  const navigate = useNavigate();
  return (
    <Box>
      <StyledContainer>
        <StyledGradient />
        <StyledImage
          component={`img`}
          src="./img/mainImg3.png"
          alt="Main Image"
          width={"100%"}
          height={"800px"}
        />
        <StyledTextContainer>
          <StyledFirstTypo
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1,
            }}
            sx={{}}
          >
            HIStudy
          </StyledFirstTypo>
          <StyledSecondTypo
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 2,
            }}
            sx={{}}
          >
            Make your study Group and Enjoy
          </StyledSecondTypo>

          <StyledButton
            component={motion.button}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 3,
            }}
            variant="outlined"
            onClick={() => navigate(mainButtonReturner("link") as string)}
          >
            {mainButtonReturner("text")}
          </StyledButton>
        </StyledTextContainer>
      </StyledContainer>
    </Box>
  );
}
