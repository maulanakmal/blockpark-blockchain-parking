import * as React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Avatar, Button, Card, Text as PaperText } from "react-native-paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthProvider";
import { get_all_providers } from "../../api/get_all_providers";

export default function ProviderList({ navigation }) {
  const { user } = React.useContext(AuthContext);
  console.log(user);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const providers = await get_all_providers(user.token);
      console.log("providers is " + providers);
      setData(providers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function navigateToProviderDetails(provider) {
    navigation.navigate("ProviderDetails", { provider });
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigateToProviderDetails(item)}>
        <Card style={{ padding: 16, margin: 10 }}>
          <Card.Title title={item.provider_name} subtitle={item.address} />
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.provider_name.toString()}
      />
    </View>
  );
}
