import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import CustomBubble from "../components/Custom-Bubble";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
export default function Events({ navigation }) {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
  }, []);
  return (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      <View style={styles.root}>
        <Text style={styles.fontDesign}>{"Events"}</Text>
        <View style={styles.anRoot}>
          <View style={styles.sm_bubble}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                margin: 5,
              }}
            >
              <Ionicons name="person-circle" size={28} color={Colors.white} />
              <Text style={styles.fontDesn}>Testing</Text>
              <Text style={styles.fontDesn}>Test Name</Text>
              <Text style={styles.fontDesn}>20-2020-May</Text>
            </View>
          </View>
        </View>
        <View style={styles.anRoot}>
          <View style={styles.sm_bubble}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                margin: 5,
              }}
            >
              <Ionicons name="person-circle" size={28} color={Colors.white} />
              <Text style={styles.fontDesn}>Mashood</Text>
              <Text style={styles.fontDesn}>Check</Text>
              <Text style={styles.fontDesn}>5-2022-May</Text>
            </View>
          </View>
        </View>
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  sm_bubble: {
    height: 90,
    width: 90,
    borderRadius: 360,
    backgroundColor: Colors.pink,
  },
  root: {
    flex: 1,
    marginTop: size / 11,

    alignItems: "center",
    flexDirection: "column",
  },
  anRoot: {
    marginTop: size / 11,
    flexDirection: "row",

    alignItems: "center",
  },
  fontDesign: {
    fontFamily: "GothicA1-Regular",

    color: Colors.white,
    fontSize: 24,
  },
  fontDesn: {
    fontFamily: "GothicA1-Regular",

    color: Colors.white,
    fontSize: 9,
  },
});
