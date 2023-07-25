import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const Grid = ({ slots, showPopupFunction }) => {
  const windowWidth = Dimensions.get("window").width;
  const columns = 5; // Jumlah kolom yang diinginkan
  const totalSlots = slots.length; // Jumlah total slot
  const gap = 4;
  const margin = gap / 2;

  const paddingHorizontal = 20;
  const itemSize =
    (windowWidth - paddingHorizontal * 2 - gap * (1 + columns)) / columns;
  console.log(slots);

  const renderGridItem = (itemIndex) => {
    const slot = slots[itemIndex];
    const slotStatus = slot.status;

    // Set warna berdasarkan status slot
    const backgroundColor = slotStatus === 1 ? "#FF0000" : "#00FF00";

    // Nomor slot parkir
    const parkingSlotNumber = slot.slot_number;

    return (
      <TouchableOpacity
        style={[
          styles.gridItem,
          { width: itemSize, height: itemSize, backgroundColor, margin },
          margin,
        ]}
        key={itemIndex}
        onPress={() => {
          // only show when its free
          if (slot.status == 0) {
            showPopupFunction(slot);
          }
        }}
      >
        <Text style={styles.slotNumber}>{parkingSlotNumber}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: "#00FF00" }]} />
          <Text style={styles.legendText}>Free</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: "#FF0000" }]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
      </View>
      <View style={[styles.container, { paddingHorizontal }]}>
        {[...Array(totalSlots)].map((_, index) => renderGridItem(index))}
      </View>
    </View>
  );
};

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

export default Grid;
