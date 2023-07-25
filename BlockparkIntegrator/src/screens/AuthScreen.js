import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import React from "react";
import { Provider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "../core/theme";
import StartScreen from "./StartScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import Dashboard from "./Dashboard";
import ResetPasswordScreen from "./ResetPasswordScreen";

export default function AuthScreen() {
  const Stack = createStackNavigator();
  return (
    <Provider theme={theme}>
      <Stack.Navigator
        initialRouteName="StartScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
      </Stack.Navigator>
    </Provider>
  );
}
