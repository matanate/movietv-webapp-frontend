// AppContext.js
import React from "react";
import { AuthProvider } from "./AuthContext";
import { AxiosProvider } from "./AxiosContext";

const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AxiosProvider>{children}</AxiosProvider>
    </AuthProvider>
  );
};

export default AppProvider;
