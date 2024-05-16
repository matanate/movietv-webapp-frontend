import React, { createContext } from "react";
import useAxios from "../utils/useAxios";

const AxiosContext = createContext();

const AxiosProvider = ({ children }) => {
  return (
    <AxiosContext.Provider value={{ useAxios: useAxios }}>
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosContext;
export { AxiosProvider };