import {
  Backdrop,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { Document, useDoc } from "fm-react-firebase";
import { UnstyledRouterLink } from "fm-mui-x";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PostDocument } from "../types";

function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, notFound, set } = useDoc<PostDocument>(
    `posts/${id}`
  );
  const [editedData, setEditedData] = useState({
    title: "",
  });

  const onChange = (key: string, value: any) => {
    setEditedData({
      ...editedData,
      [key]: value,
    });
  };

  useEffect(() => {
    if (data) setEditedData(data);
  }, [data]);

  useEffect(() => {
    if (notFound) navigate("/");
  }, [notFound]);

  return (
    <Container sx={{ p: 3 }}>
      <Backdrop open={isLoading}>Loading</Backdrop>
      {data && (
        <Box>
          <Typography variant="h3">{data.title}</Typography>

          <Box>
            <TextField
              required
              label="Title"
              value={editedData?.title}
              fullWidth
              onChange={(e) => onChange("title", e.target.value)}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default EditPost;
