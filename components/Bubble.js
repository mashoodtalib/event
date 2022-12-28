import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/colors";

export default function Bubble({
  styleBubble,
  onpress,
  bubbleStyle,
  iconName,
  iconColor,
  iconSize,
  textStyle,
  textMessage,
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={bubbleStyle}>
      <Pressable onPress={onpress}>
        <Animated.View
          style={[
            styles.itemLoc,
            styles.item,
            styleBubble,
            { opacity: progress, transform: [{ scale }] },
          ]}
        >
          <Ionicons name={iconName} color={iconColor} size={iconSize} />
          <Text style={textStyle}>{textMessage}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    borderRadius: 360,
  },
  itemLoc: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});
