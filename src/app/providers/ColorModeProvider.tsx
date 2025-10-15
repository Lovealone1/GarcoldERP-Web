"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme } from "../shared/config/theme/Light";
import { darkTheme } from "../shared/config/theme/Dark";

type Mode = "light" | "dark" | "system";
type Ctx = {
  mode: Mode;                 
  effectiveMode: "light" | "dark"; 
  setMode: (m: Mode) => void;
  toggle: () => void;         
};

const ColorModeCtx = createContext<Ctx>({
  mode: "system",
  effectiveMode: "light",
  setMode: () => {},
  toggle: () => {},
});

const LS_KEY = "ui:mode";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useColorMode() {
  return useContext(ColorModeCtx);
}

export default function ColorModeProvider({ children }: { children: React.ReactNode }) {
  // lee preferencia guardada; por defecto "system"
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "system";
    const saved = window.localStorage.getItem(LS_KEY) as Mode | null;
    return saved ?? "system";
  });

  // escucha cambios del SO cuando está en "system"
  useEffect(() => {
    if (mode !== "system") return;
    const mm = window.matchMedia?.("(prefers-color-scheme: dark)");
    const handler = () => setMode("system"); // fuerza recomputo
    mm?.addEventListener?.("change", handler);
    return () => mm?.removeEventListener?.("change", handler);
  }, [mode]);

  // persistencia
  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, mode);
    } catch { /* no-op */ }
  }, [mode]);

  const effectiveMode: "light" | "dark" = useMemo(() => {
    if (mode === "system") return getSystemPrefersDark() ? "dark" : "light";
    return mode;
  }, [mode]);

  const theme = useMemo(() => (effectiveMode === "dark" ? darkTheme : lightTheme), [effectiveMode]);

  const toggle = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : prev === "light" ? "dark" : getSystemPrefersDark() ? "light" : "dark"));
  }, []);

  const value = useMemo<Ctx>(() => ({ mode, effectiveMode, setMode, toggle }), [mode, effectiveMode, toggle]);

  return (
    <ColorModeCtx.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeCtx.Provider>
  );
}
