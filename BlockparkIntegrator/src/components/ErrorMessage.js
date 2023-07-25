import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;

const ErrorMessage = ({ message, duration = 3000, r, type }) => {
  const [visible, setVisible] = useState(false);
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (message) {
      setVisible(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setVisible(false);
          });
        }, duration);
      });
    }
  }, [duration, message, opacity, r, type]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: opacity }]}>
        <Text style={type == 0 ? styles.errorMessage : styles.successMessage}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: screenHeight * 0.1,
    left: 0,
    right: 0,
  },
  content: {
    backgroundColor: "#111111",
    padding: 20,
    borderRadius: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
  },
  successMessage: {
    fontSize: 16,
    color: "green",
  },
});

export default ErrorMessage;
