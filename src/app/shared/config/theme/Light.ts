import { createTheme } from "@mui/material/styles";
import { baseThemeOptions } from "./Base";

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: "light",
    primary: { main: "#16a34a", contrastText: "#ffffff" }, // --tg-primary / --tg-primary-fg
    background: { default: "#ffffff", paper: "#ffffff" },  // --tg-bg / --tg-card-bg
    divider: "#cacaca",                                     // --tg-border
    text: { primary: "#0b0b0d", secondary: "#6b7280" },     // --tg-fg / --tg-muted
    tg: {
      bg: "#ffffff",
      fg: "#0b0b0d",
      muted: "#6b7280",
      border: "#cacaca",
      primaryFg: "#ffffff",
      datepickerRange: "#91d4aa",
      iconButton: "#2b7a48",
      sidebar: {
        bg: "#f5f5f5",
        fg: "#111827",
        muted: "#64748b",
        border: "#06411b",
        itemBg: "#dcfce7",
        itemFg: "#14532d",
      },
      card: { bg: "#ffffff", fg: "#0b0b0d" },
      panel: {
        bg: "color-mix(in srgb, #ffffff 92%, black 8%)",
        border: "#cacaca",
      },
      tableHead: { bg: "#0b0b0d", fg: "#ffffff" },
      placeholder: "#5c5c5c",
      pageBg: "color-mix(in srgb, #ffffff 95%, black 5%)",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#ffffff",
          color: "#0b0b0d",
        },
      },
    },
  },
});
