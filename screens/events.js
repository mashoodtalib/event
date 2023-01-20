import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import CustomBubble from "../components/Custom-Bubble";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import apis from "../constants/static-ip";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
export default function Events({ navigation }) {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const [text, onChangeText] = React.useState("");
  const [load, setIsLoad] = useState(false);

  const loaddata = () => {
    // console.log(JSON.parse(data).user.email);
    // console.log(JSON.parse(data).user.userName);
    setIsLoad(true);
    fetch(apis + "events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((dat) => {
        onChangeText(dat);
        console.log(dat);

        setIsLoad(false);
      });
  };
  useEffect(() => {
    loaddata();
  }, []);
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
        <View style={styles.container}>
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
        <View style={styles.container}>
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
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  anRoot: {
    padding: 12,
  },
  sm_bubble: {
    height: 90,
    width: 90,
    borderRadius: 360,
    backgroundColor: Colors.pink,
  },
  root: {
    flex: 1,
    padding: 20,
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
