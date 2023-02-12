import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import CustomBubble from "../components/Custom-Bubble";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import apis from "../constants/static-ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { language } from "../constants/language";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
const numColumns = width > 600 ? 3 : 2;
export default function Events() {
  const [selectLan, setSelectLan] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const [text, onChangeText] = React.useState("");
  const [load, setIsLoad] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    getLang();

    // console.log("data", data);
  }, []);

  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")));
  };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  //  const monthName = monthNames[date.getMonth()];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
        //  console.log(dat);

        setIsLoad(false);
      });
    // console.log(text);
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
        <Text style={styles.fontDesign}>
          {selectLan == 0 ? language[4].eng : language[4].arab}
        </Text>
        <View style={styles.container}>
          <FlatList
            style={{ margin: 20 }}
            data={text}
            keyExtractor={(_, item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => navigation.push("EventDetails", { item: item })}
              >
                <View style={styles.anRoot}>
                  <View
                    style={
                      index % 2 == 0
                        ? styles.sm_bubble
                        : [styles.sm_bubble, { backgroundColor: "#423242" }]
                    }
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      {item.pic === "" ? (
                        <Ionicons
                          name="person-circle"
                          size={35}
                          color={Colors.white}
                          style={{
                            marginHorizontal: 5,

                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "center",
                          }}
                        />
                      ) : (
                        <Image
                          style={{
                            height: 25,
                            width: 25,
                            borderRadius: 360,
                            marginBottom: 4,
                          }}
                          source={{ uri: item.pic }}
                        />
                      )}
                      <Text style={styles.fontDesn}>{item.name}</Text>
                      <Text style={styles.fontDesn}>{item.fname}</Text>
                      <Text style={styles.fontDesn}>{item.date}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            numColumns={numColumns}
            ListFooterComponent={() => (
              <View style={{ height: 100 }}>
                {load && <ActivityIndicator size="large" color={Colors.dark} />}
              </View>
            )}
          />
        </View>
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  anRoot: {
    padding: 12,
  },
  sm_bubble: {
    width: 105,
    height: 105,
    borderRadius: 360,
    backgroundColor: Colors.pink,
    alignItems: "center",
    padding: 4,
    // justifyContent: "center",
    flex: 1,
  },
  // width: (width - 60) / numColumns,
  // height: (height - 80) / 3,
  // backgroundColor: Colors.brown,
  // borderRadius: 15,
  // alignItems: "center",
  // justifyContent: "center",
  // margin: 10,
  // flex: 1,
  root: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },

  fontDesign: {
    fontFamily: "GothicA1-Regular",
    alignItems: "center",

    color: Colors.white,
    fontSize: 24,
  },
  fontDesn: {
    fontFamily: "GothicA1-Regular",
    textAlign: "center",
    padding: 0.2,
    marginHorizontal: 5,
    color: Colors.white,
    fontSize: 9,
  },
});
