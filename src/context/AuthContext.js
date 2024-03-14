import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = "http://localhost:8000/api/";

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

  // Function to handle user login
  const loginUser = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging in...");
    try {
      const response = await axios.post(`${API_URL}token/`, {
        email: e.target.email.value,
        password: e.target.password.value,
      });
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
      const response = await axios.post(`${API_URL}create-user/`, {
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      if (response.status === 201) {
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
          await loginUser(e);
        } catch (error) {
          console.error("Auto login after registration failed:", error);
          toast.warning("Auto login after registration failed.");
          navigate("/login"); // Redirect to login page if auto-login fails after registration
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to create user:", errorData);
        toast.update(toastId, {
          render: "Failed to create user. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        });
      }
    } catch (error) {
      console.error("An error occurred during the request:", error);
    }
  };

  // Function to handle user logout
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    toast.success("You are now logged out!");
  };

  // Function to update the access token by refreshing it
  const updateToken = async () => {
    try {
      const response = await axios.post(
        `${API_URL}token/refresh/`,
        { refresh: authTokens?.refresh },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { access, refresh } = response.data;
      setAuthTokens({ access, refresh });
      localStorage.setItem("authTokens", JSON.stringify({ access, refresh }));
      setUser(jwtDecode(access));
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logoutUser(); // Logout user if token refresh fails
      toast.warning("Refresh token exceeded. Please log in again.");
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  // Context data to be provided to consumers
  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    createUser,
  };

  useEffect(() => {
    console.log(loading);
    if (loading) {
      console.log("Refreshing token (loading)");
      updateToken(); // Automatically try to refresh token when loading
    }

    // Set up an interval for periodic token refresh
    let intervalTime = 1000 * 60 * 4; // 4 minutes
    let interval = setInterval(() => {
      if (authTokens) {
        console.log("Refreshing token (interval)");
        updateToken();
      }
    }, intervalTime);
    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
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
