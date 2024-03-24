import {
  Backdrop,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { useAuth, useDoc } from "fm-react-firebase";
import { UnstyledRouterLink } from "fm-mui-x";
import { useNavigate, useParams } from "react-router-dom";

import { PostDocument } from "../types";
import { useEffect } from "react";

function Post() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { data, isLoading, is404 } = useDoc<PostDocument>(`posts/${id}`, {
    parseDates: ["createdDate"],
  });

  useEffect(() => {
    if (is404) navigate("/");
  }, [is404]);

  return (
    <Container sx={{ p: 3 }}>
      <Backdrop open={isLoading}>Loading</Backdrop>
      {data && (
        <>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Grid item>
              <Typography variant="h3">{data.title}</Typography>
            </Grid>
            {user && (
              <Grid item>
                <UnstyledRouterLink to={`/posts/${data.id}/edit`}>
                  <Button variant="outlined">Edit</Button>
                </UnstyledRouterLink>
              </Grid>
            )}
          </Grid>
          {data.createdDate && (
            <Typography>{data.createdDate.toDateString()}</Typography>
          )}
          {data.content && (
            <Box>
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default Post;
