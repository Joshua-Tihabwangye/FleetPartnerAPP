import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import muiTheme from "./theme/muiTheme";
import "./index.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <ThemeProvider>
            <MuiThemeProvider theme={muiTheme}>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </MuiThemeProvider>
        </ThemeProvider>
    </React.StrictMode>
);
