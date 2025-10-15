import type { ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    tg: {
      bg: string;
      fg: string;
      muted: string;
      border: string;
      primaryFg: string;
      datepickerRange: string;
      iconButton: string;
      sidebar: {
        bg: string;
        fg: string;
        muted: string;
        border: string;
        itemBg: string;
        itemFg: string;
      };
      card: { bg: string; fg: string };
      panel: { bg: string; border: string };
      tableHead: { bg: string; fg: string };
      placeholder: string;
      pageBg: string;
    };
  }
  interface PaletteOptions {
    tg?: Palette["tg"];
  }
}

export const baseThemeOptions: ThemeOptions = {
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial"].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *::before, *::after": { boxSizing: "border-box" },
        body: { minHeight: "100vh" },
      },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
};