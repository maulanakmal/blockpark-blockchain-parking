import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;

const FloatingMessage = ({ type, message, rendererKey }) => {
  const duration = 3000;
  const opacity = useState(new Animated.Value(0))[0];
  const [visible, setVisible] = useState(false);
  const contentErrorStyle = [styles.content, styles.contentError];
  const contentSuccessStyle = [styles.content, styles.contentSuccess];
  const [contentStyle, setContentStyle] = useState(null);

  useEffect(() => {
    if (!message) {
      return;
    }
    setContentStyle(type == 0 ? contentErrorStyle : contentSuccessStyle);
    setVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: duration / 4,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    });
  }, [rendererKey]);

  return (
    <>
      {visible ? (
        <View style={styles.container}>
          <Animated.View style={[contentStyle, { opacity: opacity }]}>
            <Text style={{ fontSize: 16 }}>{message}</Text>
          </Animated.View>
        </View>
      ) : (
        <></>
      )}
    </>
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
    padding: 10,
    borderRadius: 8,
  },
  contentError: {
    backgroundColor: "red",
  },
  contentSuccess: {
    backgroundColor: "green",
  },
});

export default FloatingMessage;
