import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import AppRoutes from "./routes/AppRoutes";
import muiTheme from "./theme/muiTheme";
import "./index.css";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <LanguageProvider>
            <NotificationsProvider>
                <ThemeProvider>
                    <MuiThemeProvider theme={muiTheme}>
                        <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                            <AppRoutes />
                        </HashRouter>
                    </MuiThemeProvider>
                </ThemeProvider>
            </NotificationsProvider>
        </LanguageProvider>
    </React.StrictMode>
);
