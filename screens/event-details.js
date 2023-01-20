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
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const socket = io("http://192.168.100.7:3002");
import apis from "../constants/static-ip";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

function EventDetails({ navigation, route }) {
  const { item } = route.params;

  useEffect(() => {
    console.log(item);
  }, []);

  return (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      <View style={{ flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        height: hp('20%'),
    }}>
        <Ionicons
          name="person-circle"
          size={28}
          color={Colors.white}
        />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: Colors.white, fontSize: 20 }}>
            {item.name}
          </Text>
          <Text style={{ color: Colors.white, fontSize: 20 }}>
            {item.date.substring(0, 10)}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, alignItems:"center" }}>
        <Text style={{ color: Colors.white, fontSize: 20 }}>
          Tom's Birthday
        </Text>
        <Text style={{ color: Colors.white, fontSize: 20 }}>
          {item.date.substring(0, 10)}
        </Text>
        <Text style={{
          padding: 20,
          color: Colors.white, fontSize: 16 , justifyContent: "center"}}>
          we are having a party at my place
          </Text>
      </View>

    </CustomBubble>
  );
}
export default EventDetails;

const styles = StyleSheet.create({

});
