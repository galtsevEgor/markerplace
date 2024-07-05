import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  useEffect(() => {
    if (!isAuth) {
      navigate("/home");
    }
  }, [isAuth, navigate]);

  return isAuth ? <>{children}</> : null;
};

export default PrivateRoute;
