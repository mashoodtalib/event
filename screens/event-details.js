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
  const [set, setText] = React.useState("");

  useEffect(() => {
    console.log(item);
    loaddata();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    await AsyncStorage.getItem("user").then((data) => {
      fetch(apis + "otheruserdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: JSON.parse(data).user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message == "User Found") {
            setText(data.user);

            CheckFollow(data.user);
          } else {
            alert("User Not Found");
            navigation.navigate("search");
            // navigation.navigate('Login')
          }
        })
        .catch((err) => {
          // console.log(err)
          alert("Something Went Wrong");
          navigation.navigate("search");
        });

      console.log(data.user);
    });
  };

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
        CheckFollow(dat.user);

        setIsLoad(false);
      });
    console.log(text);
  };
  const FollowThisUser = async () => {
    console.log("accetpEvent");
    const loggeduser = await AsyncStorage.getItem("user");
    const loggeduserobj = JSON.parse(loggeduser);
    console.log(loggeduser);
    console.log(loggeduserobj);
    fetch(apis + "accetpEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acceptfrom: loggeduserobj.user.email,
        acceptto: item.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Event Accepted") {
          console.log(data);
          alert("Event Accepted");
          fetch(apis + "send-notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              targetUser: set.deviceToken,
              message: item.fname + " Accepted your Event",
              title: "Events",
            }),
          }).then((res) => res.json());
          loaddata();
          setIsfollowing(true);
        } else {
          alert("Something Went Wrong");
          console.log(data);
        }
      });
  };

  const [isfollowing, setIsfollowing] = React.useState(false);
  const CheckFollow = async () => {
    AsyncStorage.getItem("user").then((loggeduser) => {
      const loggeduserobj = JSON.parse(loggeduser);
      fetch(apis + "checkevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acceptfrom: loggeduserobj.user.email,
          acceptto: item.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message == "Event in following list") {
            setIsfollowing(true);
          } else if (data.message == "Event not in following list") {
            setIsfollowing(false);
          } else {
            // loaddata()
            alert("Something Went Wrong");
          }
        });
    });
  };

  const UnfollowThisUser = async () => {
    console.log("UnfollowThisUser");
    const loggeduser = await AsyncStorage.getItem("user");
    const loggeduserobj = JSON.parse(loggeduser);
    fetch(apis + "unfollowevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acceptfrom: loggeduserobj.user.email,
        acceptto: item.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Event unaccepted") {
          alert("Event unaccepted");
          fetch(apis + "send-notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              targetUser: set.deviceToken,
              message: item.fname + " UnAccepted your Event",
              title: "Events",
            }),
          }).then((res) => res.json());
          loaddata();
          setIsfollowing(false);
        } else {
          alert("Something Went Wrong");
        }
      });
  };
  return set && text ? (
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
          {item.pic === "" ? (
            <Ionicons name="person-circle" size={60} color={Colors.white} />
          ) : (
            <Image
              style={{
                height: 50,
                width: 50,
                marginRight: 8,
                borderRadius: 360,
              }}
              source={{ uri: item.pic }}
            />
          )}
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
          {item.desc}
        </Text>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {set.email === item.email ? (
            <View></View>
          ) : (
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
                <Ionicons
                  name={"ios-checkmark"}
                  size={22}
                  color={Colors.white}
                  onPress={() => FollowThisUser()}
                />
              </View>
            </Pressable>
          )}
          <View style={{ width: 10 }}></View>
          {set.email === item.email ? (
            <View></View>
          ) : (
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
                  onPress={() => UnfollowThisUser()}
                />
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </CustomBubble>
  ) : (
    <ActivityIndicator />
  );
}
export default EventDetails;

const styles = StyleSheet.create({});
