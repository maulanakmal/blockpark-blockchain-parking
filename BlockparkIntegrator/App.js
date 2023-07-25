import React, { createContext, useContext, useState } from "react";
import { AuthScreen } from "./src/screens";
import { MainScreen } from "./src/screens";
import { NavigationContainer } from "@react-navigation/native";
import AuthProvider, { AuthContext } from "./src/auth/AuthProvider";

function AppNav() {
  const { user } = useContext(AuthContext);
  return <>{user !== null ? <MainScreen /> : <AuthScreen />}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNav />
      </NavigationContainer>
    </AuthProvider>
  );
}
