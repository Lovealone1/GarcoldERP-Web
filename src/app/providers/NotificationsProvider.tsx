"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

type Severity = AlertColor; 
type Anchor = { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" };

type Notice = {
  id: string;
  message: string | React.ReactNode;
  severity: Severity;
  autoHideDuration: number | null; // null => persist
  anchor: Anchor;
  onClose?: () => void;
  action?: React.ReactNode;
  variant?: "filled" | "outlined" | "standard";
  dedupeKey?: string; // si coincide, reemplaza
};

type Ctx = {
  notify: (msg: Notice["message"], opts?: Partial<Omit<Notice, "id" | "message">>) => string;
  success: (msg: Notice["message"], ms?: number) => string;
  info: (msg: Notice["message"], ms?: number) => string;
  warning: (msg: Notice["message"], ms?: number) => string;
  error: (msg: Notice["message"], ms?: number) => string;
  close: (id: string) => void;
  clear: () => void;
};

const MAX_STACK = 4;
const DEFAULT_MS = 4000;
const DEFAULT_ANCHOR: Anchor = { vertical: "top", horizontal: "center" };

const NotificationsContext = createContext<Ctx | null>(null);

type State = { items: Notice[] };
type Action =
  | { type: "PUSH"; item: Notice }
  | { type: "CLOSE"; id: string }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PUSH": {
      // dedupe por dedupeKey si existe
      const items = action.item.dedupeKey
        ? state.items.filter((n) => n.dedupeKey !== action.item.dedupeKey)
        : state.items.slice();
      items.push(action.item);
      // mantener solo últimos MAX_STACK
      return { items: items.length > MAX_STACK ? items.slice(items.length - MAX_STACK) : items };
    }
    case "CLOSE":
      return { items: state.items.filter((n) => n.id !== action.id) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

function uid() {
  // corto, estable y colisiona poco
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useNotifications(): Ctx {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within <NotificationsProvider/>");
  return ctx;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const close = useCallback((id: string) => dispatch({ type: "CLOSE", id }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const notify = useCallback<Ctx["notify"]>(
    (message, opts) => {
      const id = uid();
      const item: Notice = {
        id,
        message,
        severity: opts?.severity ?? "info",
        autoHideDuration: opts?.autoHideDuration ?? DEFAULT_MS,
        anchor: opts?.anchor ?? DEFAULT_ANCHOR,
        onClose: opts?.onClose,
        action: opts?.action,
        variant: opts?.variant ?? "filled",
        dedupeKey: opts?.dedupeKey,
      };
      dispatch({ type: "PUSH", item });
      return id;
    },
    []
  );

  const value = useMemo<Ctx>(
    () => ({
      notify,
      success: (m, ms) => notify(m, { severity: "success", autoHideDuration: ms }),
      info: (m, ms) => notify(m, { severity: "info", autoHideDuration: ms }),
      warning: (m, ms) => notify(m, { severity: "warning", autoHideDuration: ms }),
      error: (m, ms) => notify(m, { severity: "error", autoHideDuration: ms }),
      close,
      clear,
    }),
    [notify, close, clear]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}

      {state.items.map((n, idx) => (
        <Snackbar
          key={n.id}
          open
          TransitionComponent={Slide}
          autoHideDuration={n.autoHideDuration ?? undefined}
          onClose={(_, reason) => {
            if (reason === "clickaway") return;
            close(n.id);
            n.onClose?.();
          }}
          anchorOrigin={n.anchor}
          sx={{
            zIndex: (t) => t.zIndex.modal + 1,
            pointerEvents: "none",
            "& .MuiPaper-root": { pointerEvents: "auto" },
            mt: n.anchor.vertical === "top" ? `${8 + idx * 8}px` : 0,
            mb: n.anchor.vertical === "bottom" ? `${8 + idx * 8}px` : 0,
            minWidth: 360,
          }}
        >
          <Alert
            onClose={() => {
              close(n.id);
              n.onClose?.();
            }}
            severity={n.severity}
            variant={n.variant}
            action={n.action}
            sx={{ width: "100%" }}
          >
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationsContext.Provider>
  );
}
