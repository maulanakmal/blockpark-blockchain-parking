import React, { createContext, useEffect, useState } from "react";
import { login } from "../../api/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const token = await login(email, password);
      setUser({ email, token });
      AsyncStorage.setItem("token", token);
      AsyncStorage.setItem("email", email);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    AsyncStorage.removeItem("token");
  };

  const checkSavedToken = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const email = await AsyncStorage.getItem("email");
      console.log(token);
      if (token !== null && email !== null) {
        // TODO: refresh
        setUser({ email, token });
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSavedToken();
  }, []);

  const authContextValue = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
