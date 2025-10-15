// src/shared/config/theme/dark.ts
import { createTheme } from "@mui/material/styles";
import { baseThemeOptions } from "./Base";

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: "dark",
    primary: { main: "#22c55e", contrastText: "#0b0b0d" }, // --tg-primary / --tg-primary-fg
    background: { default: "#131313", paper: "#131313" },  // --tg-bg / --tg-card-bg
    divider: "#2a2f2a",                                     // --tg-border
    text: { primary: "#e5e5e5", secondary: "#a3a3a3" },     // --tg-fg / --tg-muted
    tg: {
      bg: "#131313",
      fg: "#e5e5e5",
      muted: "#a3a3a3",
      border: "#2a2f2a",
      primaryFg: "#0b0b0d",
      datepickerRange: "#91d4aa",
      iconButton: "#2b7a48",
      sidebar: {
        bg: "#0f0f0f",
        fg: "#e5e5e5",
        muted: "#b1b1b5",
        border: "#22c55e",
        itemBg: "#052e1c",
        itemFg: "#e5e7eb",
      },
      card: { bg: "#131313", fg: "#e5e7eb" },
      panel: {
        bg: "color-mix(in srgb, #131313 85%, black 15%)",
        border: "#2a2f2a",
      },
      tableHead: { bg: "#1b1b1f", fg: "#e5e7eb" },
      placeholder: "#525252",
      pageBg: "color-mix(in srgb, #131313 96%, white 4%)",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#131313",
          color: "#e5e5e5",
        },
      },
    },
  },
});
