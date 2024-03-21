import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectRouteStaff = ({ redirectPath = "/", children }) => {
  let { user } = useContext(AuthContext);

  if (!(user && user.is_staff)) {
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectRouteStaff;
