import {
  Backdrop,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
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
    <Container sx={{ p: 3 }}>
      <Backdrop open={isLoading}>Loading</Backdrop>
      <Typography variant="h3" gutterBottom>
        Posts
      </Typography>
      {data && (
        <Box>
          {data.map((item) => (
            <UnstyledRouterLink key={item.id} to={`/posts/${item.id}`}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h5">{item.title}</Typography>
                  {item.createdDate && (
                    <Typography>{item.createdDate.toDateString()}</Typography>
                  )}
                  {user && (
                    <UnstyledRouterLink to={`/posts/${item.id}/edit`}>
                      <Button>Edit</Button>
                    </UnstyledRouterLink>
                  )}
                </CardContent>
              </Card>
            </UnstyledRouterLink>
          ))}
        </Box>
      )}
      {empty && <Box>no results</Box>}
    </Container>
  );
}

export default Posts;
