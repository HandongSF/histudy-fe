import PropTypes from "prop-types";
import { useMemo } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
//
import palette from "./palette";
import typography from "./typography";
import shadows from "./shadows";
import customShadows from "./customShadows";
import componentsOverride from "./overrides";
import GlobalStyles from "./globalStyles";
import { useRecoilValue } from "recoil";

import { darkState } from "../store/atom";

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const isDark = useRecoilValue(darkState);
  const themeMode = isDark ? "dark" : "light";

  const themeOptions = useMemo(
    () => ({
      palette: palette(themeMode),
      typography,
      shape: { borderRadius: 8 },
      direction: "ltr",
      shadows: shadows(themeMode),
      customShadows: customShadows(themeMode),
    }),
    [themeMode]
  );

  const theme = createTheme(themeOptions);

  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
