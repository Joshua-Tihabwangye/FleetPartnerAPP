import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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
                        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                            <AppRoutes />
                        </BrowserRouter>
                    </MuiThemeProvider>
                </ThemeProvider>
            </NotificationsProvider>
        </LanguageProvider>
    </React.StrictMode>
);
