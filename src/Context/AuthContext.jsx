import { createContext, useContext, useEffect, useState } from "react";
import axios from "../Utils/axios.jsx"; // Pre-configured Axios instance
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user data (including name)
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login status
  const navigate = useNavigate();

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { accessToken } = res.data;
      // Set token globally in Axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const decoded = parseJwt(accessToken);
      await fetchUserInfo(decoded.id); // Fetch full user info after login

      if (accessToken) {
        setIsLoggedIn(true);
      }

      navigate("/home"); // Redirect to home after login
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
    }
    // setTimeout(() => {
    //   setLoading(false)
    // }, 3000)
  };

  // Fetch full user info (including name)
  const fetchUserInfo = async (userId) => {
    try {
      const res = await axios.get(`/users/${userId}`);
      const { id, role, name, email } = res.data; // Assuming backend returns {id, role, name}
      setUser({ id, role, name, email });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post("/auth/logout");

      setTimeout(() => {
        setUser(null);
        setIsLoggedIn(false);
        delete axios.defaults.headers.common["Authorization"];
        setLoading(false); // only stop loading after cleanup
        navigate("/"); // Optional: Redirect to landing/login page
      }, 2000); // Animation duration (2s)
    } catch (err) {
      console.error("Logout error:", err.message);
      setLoading(false);
    }
  };
  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post("/auth/refresh");
      const { accessToken } = res.data;

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const decoded = parseJwt(accessToken);
      await fetchUserInfo(decoded.id); // Fetch user info after refreshing token
      setIsLoggedIn(true);
    } catch (err) {
      console.error(
        "Token refresh failed:",
        err.response?.data?.message || err.message
      );
      logout();
    }
  };

  // Decode JWT to extract user info
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Failed to parse JWT:", err);
      return null;
    }
  };

  // Refresh token on app load
  useEffect(() => {
    refreshAccessToken().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isLoggedIn,
      }}
    >
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
