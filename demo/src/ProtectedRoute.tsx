import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "fm-react-firebase";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user, userClaims } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
    console.log(userClaims);
  }, [user, userClaims]);

  return <Outlet />;
};

export default ProtectedRoute;
