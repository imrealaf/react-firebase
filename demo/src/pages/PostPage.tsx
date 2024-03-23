import {
  Backdrop,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useAuth, useDoc } from "fm-react-firebase";
import { UnstyledRouterLink } from "fm-mui-x";
import { useNavigate, useParams } from "react-router-dom";

import { PostDocument } from "../types";

function Post() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { data, isLoading, notFound } = useDoc<PostDocument>(`posts/${id}`);

  if (notFound) {
    navigate("/");
  }

  return (
    <Container sx={{ p: 3 }}>
      <Backdrop open={isLoading}>Loading</Backdrop>
      {data && (
        <Box>
          <Typography variant="h3">{data.title}</Typography>
          {user && (
            <UnstyledRouterLink to={`/posts/${data.id}/edit`}>
              <Button>Edit</Button>
            </UnstyledRouterLink>
          )}
        </Box>
      )}
    </Container>
  );
}

export default Post;
