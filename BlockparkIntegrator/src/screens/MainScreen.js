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
import HomeScreen from "./HomeScreen";
import ActiveSession from "./ActiveSession";
import Profile from "./Profile";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";

export default function MainScreen() {
  const icons = {
    Home: faHome,
    ActiveSession: faSearch,
    Profile: faUser,
  };
  const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icon = icons[route.name];
          return <FontAwesomeIcon icon={icon} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="ActiveSession" component={ActiveSession} />
      <Tabs.Screen name="Profile" component={Profile} />
    </Tabs.Navigator>
  );
}
