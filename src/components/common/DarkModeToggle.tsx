import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Fade, IconButton } from "@mui/material";
import { useRecoilState } from "recoil";
import { darkState } from "../../store/atom";

function DarkModeToggle() {
  const [isDark, setIsDark] = useRecoilState(darkState);

  const handleChange = () => {
    setIsDark(!isDark);
    localStorage.setItem("darkMode", (!isDark).toString());
  };

  return (
    <IconButton color="inherit" onClick={handleChange}>
      <Fade in={isDark}>
        <Brightness2Icon
          style={{ display: isDark ? "block" : "none", color: "yellow" }}
        />
      </Fade>
      <Fade in={!isDark}>
        <WbSunnyIcon
          style={{ display: isDark ? "none" : "block", color: "darkOrange" }}
        />
      </Fade>
    </IconButton>
  );
}

export default DarkModeToggle;
