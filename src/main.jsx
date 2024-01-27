import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import ContextProvider from "./AppContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider
    theme={createTheme({
      typography:{
        fontFamily: 'poppins',
        allVariants:{
          color: 'white'
        }
      },
      palette: {
        mode: "dark",
      },
    })}
  >
    <ContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextProvider>
  </ThemeProvider>
);
