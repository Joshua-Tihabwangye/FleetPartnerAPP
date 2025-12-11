import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#10b981"
    },
    secondary: {
      main: "#f97316"
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff"
    }
  },
  typography: {
    fontFamily: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif"
    ].join(",")
  }
});

export default muiTheme;
