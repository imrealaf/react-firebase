import {
  Backdrop,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { kebabCase } from "lodash";
import Editor from "react-simple-wysiwyg";
import deepEqual from "deep-equal";
import { Document, useDoc } from "fm-react-firebase";
import { Button, UnstyledRouterLink } from "fm-mui-x";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { PostDocument } from "../types";

function AddPost() {
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data, isLoading, isPending, is404, error, add } =
    useDoc<PostDocument>();
  const [id, setId] = useState<string>("");
  const [newData, setNewData] = useState<Partial<PostDocument>>({
    title: "",
    description: "",
    content: "",
  });

  const onChange = (key: string, value: any) => {
    setNewData({
      ...newData,
      [key]: value,
    });
  };

  const onSubmit = async () => {
    const finalData = {
      ...newData,
      createdDate: new Date(),
    };
    await add("posts", id, finalData);
    navigate("/posts");
  };

  const onCloseSnackbar = () => {
    setSnackbar(null);
  };

  useEffect(() => {
    setId(kebabCase(newData.title));
  }, [newData.title]);

  useEffect(() => {
    if (is404) navigate("/");
  }, [is404]);

  useEffect(() => {
    if (error) setSnackbar(error.message);
  }, [error]);

  return (
    <>
      <Backdrop open={isPending}>Loading</Backdrop>
      <Snackbar
        open={Boolean(snackbar)}
        onClose={onCloseSnackbar}
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={onCloseSnackbar}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar}
        </Alert>
      </Snackbar>
      <Container sx={{ p: 3 }}>
        <>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h3" mb={3}>
                Add Post
              </Typography>
            </Grid>
            <Grid item>
              {/* <Link to={`/posts/${data.id}`}>Go to Post</Link> */}
            </Grid>
          </Grid>

          <Box mb={3}>
            <TextField
              required
              label="Title"
              value={newData?.title}
              fullWidth
              onChange={(e) => onChange("title", e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <TextField
              required
              label="ID"
              value={id}
              fullWidth
              onChange={(e) =>
                setId(e.target.value.replace(/ /g, "-").toLowerCase())
              }
            />
          </Box>
          <Box mb={3}>
            <TextField
              label="Description"
              value={newData?.description}
              fullWidth
              onChange={(e) => onChange("description", e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <Editor
              value={newData?.content}
              onChange={(e) => onChange("content", e.target.value)}
            />
          </Box>
          <Box textAlign="center">
            <Button
              disabled={!newData.title || !id}
              variant="contained"
              pill
              size="large"
              sx={{ px: 3 }}
              onClick={onSubmit}
            >
              Save
            </Button>
          </Box>
        </>
      </Container>
    </>
  );
}

export default AddPost;
