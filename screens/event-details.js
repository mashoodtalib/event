import React, { useEffect, useRef, useState } from "react";
import {
  Switch,
  Animated,
  Button,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import Colors from "../constants/colors";
import CustomBubble from "../components/Custom-Bubble";
import Ionicons from "@expo/vector-icons/Ionicons";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const socket = io("http://192.168.100.7:3002");
import apis from "../constants/static-ip";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

function EventDetails({ navigation, route }) {
  const { item } = route.params;
  const [load, setIsLoad] = useState(false);
  const [text, onChangeText] = React.useState("");

  useEffect(() => {
    console.log(item);
    loaddata();
  }, []);
  const loaddata = () => {
    // console.log(JSON.parse(data).user.email);
    // console.log(JSON.parse(data).user.userName);
    setIsLoad(true);
    fetch(apis + "eventuserdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item.eventId,
      }),
    })
      .then((res) => res.json())
      .then((dat) => {
        onChangeText(dat);
        console.log(dat);

        setIsLoad(false);
      });
    console.log(text);
  };
  return text ? (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 25,
          height: hp("20%"),
        }}
      >
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Ionicons name="person-circle" size={60} color={Colors.white} />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            //justifyContent: "center",
            paddingRight: hp("7%"),
          }}
        >
          <Text style={{ color: Colors.brown, fontSize: 20 }}>
            {text.user.name}
          </Text>
          <Text style={{ color: Colors.brown, fontSize: 20 }}>
            {"@" + text.user.userName}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={{ color: Colors.white, fontSize: 20, paddingBottom: 10 }}>
          {item.name}
        </Text>
        <Text style={{ color: Colors.pink, fontSize: 20 }}>{item.date}</Text>
        <Text
          style={{
            padding: 8,
            color: Colors.white,
            fontSize: 16,
            justifyContent: "center",
          }}
        >
          we are having a party at my place
        </Text>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable>
            <View
              style={{
                alignItems: "center",
                backgroundColor: Colors.brown,
                height: 30,
                width: 60,
                borderRadius: 20,
              }}
            >
              <Ionicons name={"ios-checkmark"} size={22} color={Colors.white} />
            </View>
          </Pressable>
          <View style={{ width: 10 }}></View>
          <Pressable>
            <View
              style={{
                alignItems: "center",
                backgroundColor: Colors.pink,
                height: 30,
                width: 60,
                borderRadius: 20,
              }}
            >
              <Ionicons
                name={"ios-close-outline"}
                size={22}
                color={Colors.white}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </CustomBubble>
  ) : (
    <ActivityIndicator />
  );
}
export default EventDetails;

const styles = StyleSheet.create({});
