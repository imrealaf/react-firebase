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
import Editor from "react-simple-wysiwyg";
import deepEqual from "deep-equal";
import { Document, useDoc } from "fm-react-firebase";
import { Button, UnstyledRouterLink } from "fm-mui-x";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { PostDocument } from "../types";

function EditPost() {
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isPending, is404, error, update } =
    useDoc<PostDocument>(`posts/${id}`, {
      parseDates: ["createdDate"],
    });
  const [editedData, setEditedData] = useState<Partial<PostDocument>>({
    title: "",
    description: "",
    content: "",
  });

  const onChange = (key: string, value: any) => {
    setEditedData({
      ...editedData,
      [key]: value,
    });
  };

  const onSubmit = async () => {
    await update(editedData);
    setSnackbar("Post has been updated");
  };

  const onCloseSnackbar = () => {
    setSnackbar(null);
  };

  useEffect(() => {
    if (data) setEditedData(data);
  }, [data]);

  useEffect(() => {
    if (is404) navigate("/");
  }, [is404]);

  useEffect(() => {
    if (error) setSnackbar(error.message);
  }, [error]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <>
      <Backdrop open={isLoading || isPending}>Loading</Backdrop>
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
        {data && (
          <>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h3" mb={3}>
                  {data.title}
                </Typography>
              </Grid>
              <Grid item>
                <Link to={`/posts/${data.id}`}>Go to Post</Link>
              </Grid>
            </Grid>

            <Box mb={3}>
              <TextField
                required
                label="Title"
                value={editedData?.title}
                fullWidth
                onChange={(e) => onChange("title", e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <TextField
                label="Description"
                value={editedData?.description}
                fullWidth
                onChange={(e) => onChange("description", e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <Editor
                value={editedData?.content}
                onChange={(e) => onChange("content", e.target.value)}
              />
            </Box>
            <Box textAlign="center">
              <Button
                disabled={!editedData.title || deepEqual(data, editedData)}
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
        )}
      </Container>
    </>
  );
}

export default EditPost;
