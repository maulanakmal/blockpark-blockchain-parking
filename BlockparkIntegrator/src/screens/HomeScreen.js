import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProviderList from "./ProviderList";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import ProviderDetails from "./ProviderDetails";

export default function HomeScreen({ navigation }) {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProviderList" component={ProviderList} />
      <Stack.Screen name="ProviderDetails" component={ProviderDetails} />
    </Stack.Navigator>
  );
}
