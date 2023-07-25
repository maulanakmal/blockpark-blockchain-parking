import * as React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { get_active_session } from "../../api/get_active_session";
import { AuthContext } from "../auth/AuthProvider";
import { useContext, useState, useEffect } from "react";

export default function ActiveSession() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = React.useContext(AuthContext);
  const [activeSession, setActiveSession] = useState(null);
  const [parkingSlot, setParkingSlot] = useState(null);
  const [parkingProvider, setParkingProvider] = useState(null);
  const [status, setStatus] = useState(false);

  const windowWidth = Dimensions.get("window").width;
  const columns = 5; // Jumlah kolom yang diinginkan
  const gap = 4;
  const margin = gap / 2;

  const paddingHorizontal = 20;
  const itemSize =
    (windowWidth - paddingHorizontal * 2 - gap * (1 + columns)) / columns;

  const fetchData = async () => {
    try {
      const response = await get_active_session(user.token);
      setActiveSession(response.active_session);
      setParkingSlot(response.parking_slot);
      setParkingProvider(response.provider_info);
      setStatus(response.status);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text> {status} </Text>
      {status === true ? (
        <>
          <Text style={{ fontSize: 18 }}>You are currently at</Text>
          <Text style={{ fontSize: 20 }}>{parkingProvider.provider_name}</Text>
          <Text style={{ fontSize: 16 }}>{parkingProvider.address}</Text>
          <View
            style={[
              styles.gridItem,
              {
                width: itemSize,
                height: itemSize,
                backgroundColor: "green",
                margin: 20,
              },
            ]}
          >
            <Text style={styles.slotNumber}>{parkingSlot.slot_number}</Text>
          </View>
        </>
      ) : (
        <>
          <Text>You are currently not at any parking slot</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  },
  slotNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  legendContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center", // Align legend items together in the center
    marginTop: 25,
    marginBottom: 25,
  },
  legendItem: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  legendBox: {
    width: 20,
    height: 20,
    marginRight: 5, // Add some space between legend box and text
  },
  legendText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
