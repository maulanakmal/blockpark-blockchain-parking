import * as React from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingPopUp from "./BookingPopUp";
import { get_available_parking_slot_by_provider_id } from "../../api/get_available_parking_slot_by_provider_id";
import { AuthContext } from "../auth/AuthProvider";
import Grid from "../components/ParkingSlotGrid";
import ErrorMessage from "../components/ErrorMessage";
import FloatingMessage from "../components/FloatingMessage";

export default function ProviderDetails({ route }) {
  const { user } = React.useContext(AuthContext);
  const token = user.token;
  const provider = route.params.provider;
  console.log(provider);

  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const parkingSlots = await get_available_parking_slot_by_provider_id(
        provider.provider_id,
        token
      );
      console.log(parkingSlots);
      setData(parkingSlots);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [visibility, setVisibility] = useState(false);
  const [selectedParkingSlot, setSelectedParkingSlot] = useState(null);

  const showParkingSlotBookingPopUp = (parkingSlot) => {
    setSelectedParkingSlot(parkingSlot);
    setVisibility(true);
  };

  const closeParkingSlotBookingPopUp = () => {
    setSelectedParkingSlot(null);
    setVisibility(false);
    fetchData();
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => showParkingSlotBookingPopUp(item)}
      >
        <View style={{ padding: 16 }}>
          <Text style={styles.itemText} t>
            {item.slot_number}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [messageType, setMessageType] = useState(0); // error
  const [errorRendererKey, setErrorRendererKey] = useState(0);

  const showError = (text) => {
    setErrorMessage(text);
    setMessageType(0);
    setErrorRendererKey(errorRendererKey + 1);
  };

  const showSuccess = (text) => {
    setErrorMessage(text);
    setMessageType(1);
    setErrorRendererKey(errorRendererKey + 1);
  };

  const numColumns = 5;
  return (
    <View>
      <BookingPopUp
        showError={showError}
        showSuccess={showSuccess}
        visibility={visibility}
        close={closeParkingSlotBookingPopUp}
        provider={provider}
        parkingSlot={selectedParkingSlot}
      />
      <Grid slots={data} showPopupFunction={showParkingSlotBookingPopUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: 16,
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaeaea",
    height: 100,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
