import { useRecoilState } from "recoil";
import { Switch } from "@mui/material";
import { darkState } from "../store/atom";

function DarkModeToggle() {
  const [isDark, setIsDark] = useRecoilState(darkState);
  const handleChange = (event) => {
    setIsDark(event.target.checked);
  };
  localStorage.setItem("darkMode", isDark.toString());
  return <Switch checked={isDark} onChange={handleChange} />;
}

export default DarkModeToggle;
