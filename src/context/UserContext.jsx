import { createContext, useContext, useEffect, useState } from "react";
import { getUserInformation } from "../services/UserService";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      try {
        const userInfo = await getUserInformation();
        setUser(userInfo);
      } catch {
        setUser(null);
      }
    };
    if (isAuthenticated) {
      fetchUser();
    } else {
    setUser(null); 
  }
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);