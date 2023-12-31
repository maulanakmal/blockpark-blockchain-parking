import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Logo() {
  return (
    <Image
      source={require("../assets/blockpark_logo.png")}
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    marginBottom: 8,
  },
});
