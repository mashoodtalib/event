import React, {
  useLayoutEffect,
  Component,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import Bubble from "../components/Bubble";
import { language } from "../constants/language";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis from "../constants/static-ip";
import io from "socket.io-client";
import * as Device from "expo-device";

import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

const socket = io("http://192.168.100.7:3001");
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
function HomePage() {
  const [selectLan, setSelectLan] = useState(0);
  const [leftBubbleAnim, setLeftBubbleAnim] = useState(new Animated.Value(0));
  const [rightBubbleAnim, setRightBubbleAnim] = useState(new Animated.Value(0));
  const [saveNot, issaveNot] = useState("");
  const navigation = useNavigation();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  AsyncStorage.getItem("user")
    .then((data) => {
      // console.log("data", data);
    })
    .catch((err) => alert(err));

  useEffect(() => {
    getLang();
    console.log(saveNot);

    // console.log("data", data);
  }, []);

  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")));
  };
  const [userdata, setUserdata] = React.useState(null);
  const [save, setSave] = React.useState(null);

  // useEffect(() => {
  //   loaddata();
  //   // console.log(save.user.email);
  // }, []);
  // const loaddata = async () => {
  //   //console.log(userdata.profile_pic_name);
  //   AsyncStorage.getItem("user")
  //     .then(async (value) => {
  //       fetch(apis + "userdata", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + JSON.parse(value).token,
  //         },
  //         body: JSON.stringify({ email: JSON.parse(value).user.email }),
  //       })
  //         .then((res) => res.json())
  //         .then((data) => {
  //           if (data.message == "User Found") {
  //             console.log("userdata ", userdata);
  //             //  console.log("hhhhhhhhh", save);

  //             setUserdata(data.user);
  //           } else {
  //             alert("Login Again");
  //             navigation.push("Login");
  //           }
  //         })
  //         .catch((err) => {
  //           navigation.push("Login");
  //         });
  //     })
  //     .catch((err) => {
  //       navigation.push("Login");
  //     });
  // };
  useEffect(() => {
    Animated.timing(leftBubbleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(rightBubbleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={{ flex: 1, height: height }}>
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onpress={() =>
          navigation.navigate(
            "allFriends",

            { disabledAnimation: true }
          )
        }
        bubbleStyle={{
          top: hp("10%"),
          position: "absolute",
          zIndex: 1,
          left: -10,
        }}
        styleBubble={{
          backgroundColor: Colors.dark,
          height: hp("27%"),
          width: wp("50%"),
        }}
        iconName={"md-chatbubble-ellipses-outline"}
        textMessage={selectLan == 0 ? language[0].eng : language[0].arab}
        iconSize={48}
        iconColor={Colors.pink}
        textStyle={styles.text}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onpress={() => navigation.push("Settings", { disabledAnimation: true })}
        styleBubble={{
          backgroundColor: Colors.orange,
          height: hp("18%"),
          width: wp("34%"),
        }}
        bubbleStyle={{
          top: hp("8%"),
          position: "absolute",
          zIndex: 1,
          right: 15,
        }}
        iconName={"md-settings-outline"}
        textMessage={selectLan == 0 ? language[1].eng : language[1].arab}
        iconSize={42}
        iconColor={Colors.dark}
        textStyle={styles.textone}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onpress={() =>
          navigation.push("CreateEvent", { disabledAnimation: true })
        }
        bubbleStyle={{
          top: hp("35%"),
          position: "absolute",
          zIndex: 1,
          right: -30,
        }}
        styleBubble={{
          backgroundColor: Colors.brown,
          height: hp("32%"),
          width: wp("60%"),
        }}
        iconName={"add-sharp"}
        textMessage={selectLan == 0 ? language[2].eng : language[2].arab}
        iconSize={48}
        iconColor={Colors.dark}
        textStyle={styles.texttwo}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onpress={() =>
          navigation.navigate("ProfileScreen", { disabledAnimation: true })
        }
        bubbleStyle={{
          top: hp("45%"),
          position: "absolute",
          zIndex: 1,
          left: -30,
        }}
        styleBubble={{
          backgroundColor: Colors.pink,
          height: hp("29%"),
          width: wp("54%"),
        }}
        iconName={"person-outline"}
        textMessage={selectLan == 0 ? language[3].eng : language[3].arab}
        iconSize={48}
        iconColor={Colors.brown}
        textStyle={styles.texttwo}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onpress={() => navigation.push("Events", { disabledAnimation: true })}
        bubbleStyle={{
          top: hp("70%"),
          position: "absolute",
          zIndex: 1,
          right: 2,
        }}
        styleBubble={{
          backgroundColor: Colors.dark,
          height: hp("25%"),
          width: wp("46%"),
        }}
        iconName={"calendar-outline"}
        textMessage={selectLan == 0 ? language[4].eng : language[4].arab}
        iconSize={40}
        iconColor={Colors.orange}
        textStyle={styles.text}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onpress={() => navigation.push("search", { disabledAnimation: true })}
        bubbleStyle={{
          top: hp("75%"),
          position: "absolute",
          zIndex: 1,
          left: 25,
        }}
        styleBubble={{
          backgroundColor: Colors.orange,
          height: hp("18%"),
          width: wp("34%"),
        }}
        iconName={"search-outline"}
        textMessage={selectLan == 0 ? language[5].eng : language[5].arab}
        iconSize={40}
        iconColor={Colors.dark}
        textStyle={styles.text}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 20,
  },

  text: {
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 24,
    paddingTop: 8,
  },
  textone: {
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 20,
    paddingTop: 4,
  },
  texttwo: {
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 32,
    paddingTop: 4,
    textAlign: "center",
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "tomato",
    position: "absolute",
    left: 160,
    //top:150,
  },
  button: {
    width: 150,
    height: 70,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fc5c65",
    marginVertical: 50,
  },
  secondContainer: {
    padding: 10,
  },
  firstContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  secondContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  thirdContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
});
export default HomePage;
