import React, { createContext } from "react";
import { AuthProvider } from "./AuthContext";
import { AxiosProvider } from "./AxiosContext";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const contextData = {};
  return (
    <AppContext.Provider value={contextData}>
      <AuthProvider>
        <AxiosProvider>{children}</AxiosProvider>
      </AuthProvider>
    </AppContext.Provider>
  );
};

export default AppContext;
export { AppProvider };
