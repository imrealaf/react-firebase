import { Link } from "react-router-dom";
import Routes from "./Routes";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { UnstyledRouterLink } from "fm-mui-x";
import { useAuth } from "fm-react-firebase";

function App() {
  const { signOut, user } = useAuth();
  // const { user } = useUser();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            React Firebase
          </Typography>
          <UnstyledRouterLink to="/">
            <Button color="inherit">Home</Button>
          </UnstyledRouterLink>
          <UnstyledRouterLink to="/posts">
            <Button color="inherit">Posts</Button>
          </UnstyledRouterLink>
          {!user ? (
            <UnstyledRouterLink to="/sign-in">
              <Button color="inherit">Sign In</Button>
            </UnstyledRouterLink>
          ) : (
            <Button color="inherit" onClick={signOut}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <main>
        <Routes />
      </main>
    </>
  );
}

export default App;
