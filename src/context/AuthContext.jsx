import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

const AuthContext = createContext();

// Function to get stored tokens from localStorage
const getStoredTokens = () => {
  const storedTokens = localStorage.getItem("authTokens");
  return storedTokens ? JSON.parse(storedTokens) : null;
};

const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(getStoredTokens());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const baseUrl =
    (window.location.hostname === "localhost" ||
      window.location.hostname.startsWith("192.168.") ||
      window.location.hostname === "127.0.0.1") &&
    window.location.port === "3000"
      ? "http://localhost:8000"
      : `${window.location.protocol}//${window.location.hostname}/backend`;

  // Function to handle user login
  const loginUser = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    try {
      const response = await axios.post(
        `${baseUrl}/token/`,
        {
          email: e.target.email.value,
          password: e.target.password.value,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access, refresh } = response.data;
      setAuthTokens({ access, refresh });
      localStorage.setItem("authTokens", JSON.stringify({ access, refresh }));
      const userData = jwtDecode(access);
      setUser(userData);

      navigate(-1); // Redirect to the home page after successful login
      toast.update(toastId, {
        render: `Welcome ${userData.username} you are now logged in!`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    } catch (error) {
      console.error("Login failed:", error);
      toast.update(toastId, {
        render: "Login failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    }
  };

  // Function to handle user registration
  const createUser = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating user...");
    try {
      const response = await axios.post(
        `${baseUrl}/create-user/`,
        {
          username: e.target.username.value,
          email: e.target.email.value,
          password: e.target.password.value,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      console.log("User created successfully:", data);
      toast.update(toastId, {
        render: `User "${e.target.username.value}" created successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });

      // Auto-login after registration
      try {
        loginUser(e);
      } catch (error) {
        console.error("Auto login after registration failed:", error);
        toast.warning("Auto login after registration failed.");
        navigate("/login"); // Redirect to login page if auto-login fails after registration
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.update(toastId, {
        render: "Failed to create user. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    }
  };

  // Function to handle user logout
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    toast.success("You are now logged out!");
  };

  // Context data to be provided to consumers
  const contextData = {
    user: user,
    authTokens: authTokens,
    setUser: setUser,
    setAuthTokens: setAuthTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    createUser: createUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  // Render the AuthProvider with context data and children
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthProvider };
