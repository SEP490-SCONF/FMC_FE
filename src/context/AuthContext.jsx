import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi, refreshToken } from "../services/AuthenService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const logoutTimer = useRef(null);

  // Xoá timer
  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  // Logout
  const logout = useCallback(async () => {
    clearLogoutTimer();
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API failed:", err);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresAt");
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  // Login
  const login = useCallback(
    (accessToken, expiresAt) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("expiresAt", expiresAt);
      setIsAuthenticated(true);

      if (expiresAt) {
        const expiresIn = new Date(expiresAt).getTime() - Date.now();
        if (expiresIn > 0) {
          clearLogoutTimer();
          // Đặt timer gọi refresh trước khi hết hạn 30s
          const refreshTime = expiresIn > 30000 ? expiresIn - 30000 : 0;
          logoutTimer.current = setTimeout(() => {
            tryRefreshToken();
          }, refreshTime);
        }
      }

      navigate("/");
    },
    [navigate]
  );

  // Refresh token
  const tryRefreshToken = useCallback(async () => {
    
    try {
      const data = await refreshToken();
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        if (data?.expiresAt) {
          localStorage.setItem("expiresAt", data.expiresAt);
        }
        setIsAuthenticated(true);

        // Reset timer với thời gian hết hạn mới
        if (data?.expiresAt) {
          const expiresIn = new Date(data.expiresAt).getTime() - Date.now();
          clearLogoutTimer();
          const refreshTime = expiresIn > 30000 ? expiresIn - 30000 : 0;
          logoutTimer.current = setTimeout(() => {
            tryRefreshToken();
          }, refreshTime);
        }

        return true;
      }
    } catch (err) {
      console.error("Refresh token failed:", err);
    }
     logout();
    return false;
  }, [ logout]);

  // Kiểm tra token khi reload
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const expiresAt = localStorage.getItem("expiresAt");
     

      if (token) {
        const now = Date.now();
        const expTime = expiresAt ? new Date(expiresAt).getTime() : null;

        if (!expTime || now < expTime) {
          // Token còn hạn
          setIsAuthenticated(true);

          // Đặt timer refresh trước 30s
          if (expTime) {
            clearLogoutTimer();
            const refreshTime = expTime - now > 30000 ? expTime - now - 30000 : 0;
            logoutTimer.current = setTimeout(() => {
              tryRefreshToken();
            }, refreshTime);
          }
        } else {
          // Token đã hết hạn => refresh ngay
          const refreshed = await tryRefreshToken();
          if (!refreshed) {
            // Chỉ logout nếu refresh thất bại
            logout();
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    return () => clearLogoutTimer();
  }, [logout, tryRefreshToken]);

  const value = {
    isAuthenticated,
    login,
    logout,
    tryRefreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
