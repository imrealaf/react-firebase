import { configDotenv } from "dotenv";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { renderAppWithAuth } from "fm-react-firebase";

import App from "./App";

configDotenv({
  path: "../../.env",
});

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_DATABASE_URL,
  databaseURL: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

renderAppWithAuth(config)(
  <ThemeProvider theme={createTheme()}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
  (user) => {
    // store.dispatch(setUser(user));
  }
);
