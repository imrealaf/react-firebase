import {
  Routes as BrowserRoutes,
  Route,
  Navigate,
  RouteProps,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Posts from "./pages/Posts";
import Post from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import AddPost from "./pages/AddPost";
import ProtectedPage from "./pages/ProtectedPage";

const routes: RouteProps[] = [
  {
    path: "/",
    element: <Home />,
    index: true,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/posts",
    element: <Posts />,
  },
  {
    path: "/posts/:id",
    element: <Post />,
  },
];

const protectedRoutes: RouteProps[] = [
  {
    path: "/dashboard",
    element: <ProtectedPage />,
  },
  {
    path: "/posts/:id/edit",
    element: <EditPost />,
  },
  {
    path: "/posts/add",
    element: <AddPost />,
  },
];

export default function Routes() {
  return (
    <BrowserRoutes>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
      <Route element={<ProtectedRoute />}>
        {protectedRoutes.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </BrowserRoutes>
  );
}
