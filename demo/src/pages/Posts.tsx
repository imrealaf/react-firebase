import {
  Backdrop,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useCollection, useAuth } from "fm-react-firebase";
import { Button, UnstyledRouterLink } from "fm-mui-x";

import { PostDocument } from "../types";

function Posts() {
  const { user } = useAuth();
  const { data, isLoading, empty } = useCollection<PostDocument>("posts", {
    parseDates: ["createdDate"],
  });
  return (
    <>
      <Backdrop open={isLoading}>Loading</Backdrop>
      <Container sx={{ p: 3, py: empty ? 6 : 3 }}>
        {data && !empty && (
          <>
            <Typography variant="h3" mb={3}>
              Posts
            </Typography>
            {data.map((item) => (
              <UnstyledRouterLink key={item.id} to={`/posts/${item.id}`}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item xs={11}>
                        <Typography variant="h5">{item.title}</Typography>
                        {item.createdDate && (
                          <Typography variant="body2" mb={1}>
                            {item.createdDate.toDateString()}
                          </Typography>
                        )}
                        {item.description && (
                          <Typography>{item.description}</Typography>
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        {user && (
                          <UnstyledRouterLink to={`/posts/${item.id}/edit`}>
                            <Button variant="contained" fullWidth>
                              Edit
                            </Button>
                          </UnstyledRouterLink>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </UnstyledRouterLink>
            ))}
          </>
        )}
        {empty && (
          <Box textAlign="center">
            <Typography color="primary.main" variant="h3" mb={2}>
              Sorry
            </Typography>
            <Typography variant="h5">
              There are no posts to show you at this time
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}

export default Posts;
