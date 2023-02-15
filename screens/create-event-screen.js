import React, { useEffect, useRef, useState } from "react";
import RadioButton, {
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

//import CalendarPicker from "react-native-calendar-picker";
import DatePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
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

import RadioForm from "react-native-simple-radio-button";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://192.168.100.7:3002");
import apis from "../constants/static-ip";
import { ScrollView } from "react-native";
import { language } from "../constants/language";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

function CreateEventScreen({ navigation }) {
  const [isActive, setIsActive] = useState();
  const [load, setIsLoad] = useState(false);
  const [selectLan, setSelectLan] = useState(0);

  const month = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  useEffect(() => {
    getLang();

    // console.log("data", data);
  }, []);

  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")));
  };
  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  // async function registerForPushNotificationsAsync() {
  //   let token;

  //   if (Platform.OS === "android") {
  //     await Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

  //   if (Device.isDevice) {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       alert("Failed to get push token for push notification!");
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log(token);
  //   } else {
  //     alert("Must use physical device for Push Notifications");
  //   }

  //   return token;
  // }
  // useEffect(() => {
  //   // const socket = io("http://192.168.100.7:3002");
  //   socket.on("eventName", (event) => {
  //     Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: event.name,
  //         body: event.date,
  //         data: { data: navigation.push("EventDetails", { item: event }) },
  //         //  data: { data: "hoes" },
  //       },
  //       trigger: { seconds: 2 },
  //     });

  //     // Alert.alert("New Event", `A new event "${event.name}" has been created!`);
  //   });
  // }, []);
  const showDatepicker = () => {
    showMode("date");
  };
  // const d = new Date("July 21, 1983 01:15:00");

  const [text, onChangeText] = React.useState("");
  const [desc, onChangeDesc] = React.useState("");

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
  }, []);
  // 0 pulic,1 prrivate
  var radio_props = [
    { label: "Private", value: 0 },
    { label: "Public", value: 1 },
  ];
  const eventSet = async () => {
    console.log("****");
    if (text === "" || date === "" || desc === "") {
      alert("Please fill all the fields");
    } else {
      setIsLoad(true);
      await AsyncStorage.getItem("user").then((data) => {
        console.log(JSON.parse(data).user.profile_pic_name);
        // console.log(JSON.parse(data).user.userName);

        fetch(apis + "addevent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: JSON.parse(data).user._id,
            name: text,
            date: date,
            desc: desc,
            fname: JSON.parse(data).user.userName,
            deviceToken: JSON.parse(data).user.deviceToken,
            isPrivate: isActive == 1 ? false : true,
            email: JSON.parse(data).user.email,
            pic: JSON.parse(data).user.profile_pic_name,
          }),
        })
          .then((res) => res.json())
          .then((dat) => {
            if (dat.message == "Event Added Successfully") {
              fetch(apis + "setuserevents", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: JSON.parse(data).user._id,
                  name: text,
                  date: date,
                  desc: desc,
                  email: JSON.parse(data).user.email,
                  pic: JSON.parse(data).user.profile_pic_name,
                  fname: JSON.parse(data).user.userName,
                  isPrivate: isActive == 1 ? false : true,
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.message == "Event Added Successfully") {
                    socket.emit(
                      "eventName",
                      JSON.stringify({
                        eventId: JSON.parse(data).user._id,
                        name: text,
                        date: date,
                        desc: desc,
                        email: JSON.parse(data).user.email,
                        pic: JSON.parse(data).user.profile_pic_name,
                        fname: JSON.parse(data).user.userName,
                        isPrivate: isActive == 1 ? false : true,
                      })
                    );

                    console.log("Event Added Successfully", data);
                  }
                });

              Alert.alert("Event Added Successfully");
              navigation.navigate(
                "SendEvents",
                { data: JSON.parse(data).user.userName },
                { disabledAnimation: true }
              );
              setIsLoad(false);
              onChangeText("");
            } else {
              alert("Something went Wrong");
              setIsLoad(false);
            }
          });
      });
    }
  };
  return (
    <CustomBubble
      bubbleColor={Colors.brown}
      crossColor={Colors.pink}
      navigation={navigation}
    >
      <View
        style={{ width: "100%", flexDirection: "column", marginHorizontal: 6 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{
            marginBottom: size / 10,
            marginTop: size / 12,
            height: "100%",
          }}
        >
          <View style={styles.root}>
            <Text style={[styles.fontDesign, { fontSize: 24 }]}>
              {selectLan == 0 ? language[2].eng : language[2].arab}
            </Text>
            <View style={styles.anRoot}>
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? language[20].eng : null}
              </Text>
              <TextInput
                textAlign="center"
                cursorColor={Colors.brown}
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
              />
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? null : language[20].arab}
              </Text>
            </View>
            <View style={styles.anRoot}>
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? language[21].eng : null}
              </Text>
              <TextInput
                textAlign="center"
                cursorColor={Colors.brown}
                style={[styles.input]}
                onChangeText={onChangeDesc}
                value={desc}
              />
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? null : language[21].arab}
              </Text>
            </View>
            <View style={styles.anRoot}>
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? language[22].eng : null}
              </Text>
              <Pressable
                // style={styles.input}
                onPress={showDatepicker}
                title="Pick Date"
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={[styles.dateIn, { height: 18, width: 30 }]}>
                    <Text style={styles.fontDesign1}>
                      {date.getDate().toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.dateIn, { height: 18, width: 50 }]}>
                    <Text style={styles.fontDesign1}>
                      {month[date.getMonth().toLocaleString()]}
                    </Text>
                  </View>
                  <View style={[styles.dateIn, { height: 18, width: 40 }]}>
                    <Text style={styles.fontDesign1}>
                      {date.getFullYear().toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? null : language[22].arab}
              </Text>
            </View>

            <View
              style={{
                marginTop: size / 25,
                marginRight: size / 7,
                flexDirection: "row",
              }}
            >
              <Text style={[styles.fontDesign, { marginRight: 5 }]}>
                Privacy
              </Text>
              <View style={{ flexDirection: "column" }}>
                {/* To create radio buttons, loop through your array of options */}
                {radio_props.map((obj, i) => (
                  <RadioButton labelHorizontal={false} key={i}>
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <View style={styles.lanItem}>
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={isActive === i}
                        onPress={(value) => setIsActive(value)}
                        borderWidth={0}
                        buttonInnerColor={Colors.pink}
                        buttonOuterColor={Colors.white}
                        buttonSize={12}
                        buttonOuterSize={18}
                        // buttonStyle={{}}
                        // buttonWrapStyle={{ marginLeft: 10 }}
                      />
                      <RadioButtonLabel
                        obj={obj}
                        index={i}
                        onPress={(value) => setIsActive(value)}
                        labelStyle={[
                          styles.fontDesign1,
                          {
                            color: Colors.pink,
                            fontSize: 14,
                            marginLeft: 4,
                            marginBottom: 10,
                          },
                        ]}
                      />
                    </View>
                  </RadioButton>
                ))}
              </View>
            </View>
            {!load ? (
              <Pressable
                style={[styles.dateIn, { height: 20, width: 40, marginTop: 8 }]}
                onPress={() => {
                  eventSet();
                }}
              >
                <Text style={styles.fontDesign1}>Set</Text>
              </Pressable>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </ScrollView>
      </View>
    </CustomBubble>
  );
}
export default CreateEventScreen;

const styles = StyleSheet.create({
  root: {
    marginBottom: size / 10,
    alignItems: "center",
    flexDirection: "column",
  },
  anRoot: {
    marginTop: size / 25,
    flexDirection: "row",
    alignItems: "center",
  },
  fontDesign: {
    textAlign: "center",
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 18,
    marginRight: 5,
  },
  fontDesign1: {
    textAlign: "center",
    fontSize: 12,

    fontFamily: "GothicA1-Regular",
    color: Colors.white,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  dateIn: {
    margin: 5,
    alignItems: "center",
    backgroundColor: Colors.pink,
    borderRadius: 24,
    borderColor: Colors.pink,
    color: Colors.white,
    borderBottomColor: Colors.pink,
    borderBottomColor: "#000",
    overflow: "hidden",
  },
  lanItem: {
    width: "100%",
    height: 30,
    color: Colors.pink,
    flexDirection: "row",
    marginTop: 5,
    alignItems: "flex-start",
  },
  icon: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: 16,
    height: 16,
  },
  input: {
    height: 18,
    textAlign: "center",
    fontSize: 12,
    width: size / 3,
    fontFamily: "GothicA1-Medium",
    backgroundColor: Colors.pink,
    borderRadius: 24,
    borderColor: Colors.pink,
    color: Colors.white,
    borderBottomColor: Colors.pink,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderBottomColor: "#000",

    overflow: "hidden",
  },
});
