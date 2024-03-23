import { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Button } from "fm-mui-x";
import { useAuth } from "fm-react-firebase";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth({
    errorMessages: {
      "auth/invalid-email": `${email} is not a valid email`,
    },
  });
  const navigate = useNavigate();

  const onSubmit = () => {
    signIn.withEmail(email, password);
  };

  useEffect(() => {
    if (signIn.error) {
      signIn.reset();
    }
  }, [email, password]);

  useEffect(() => {
    if (signIn.success) {
      navigate("/dashboard");
    }
  }, [signIn.success]);

  return (
    <Container sx={{ p: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} lg={4}>
          <Typography variant="h5" textAlign="center" mb={3}>
            Sign In
          </Typography>
          <Card sx={{ position: "relative" }}>
            <Backdrop
              open={signIn.pending}
              sx={{
                zIndex: 50,
                position: "absolute",
                background: "rgba(255,255,255,.7)",
              }}
            >
              <CircularProgress />
            </Backdrop>
            <CardContent sx={{ textAlign: "center" }}>
              {signIn.error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {signIn.error.message}
                </Alert>
              )}
              <TextField
                name="email"
                label="Email"
                value={email}
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                name="password"
                label="Password"
                value={password}
                fullWidth
                sx={{ mb: 2 }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                pill
                variant="contained"
                disabled={!email || !password}
                onClick={onSubmit}
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SignIn;
