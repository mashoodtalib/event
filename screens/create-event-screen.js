import React, { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
//import CalendarPicker from "react-native-calendar-picker";
import DatePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import {
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
} from "react-native";
import Colors from "../constants/colors";
import CustomBubble from "../components/Custom-Bubble";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

function CreateEventScreen({ navigation }) {
  const [s, sets] = useState(0);
  const [p, setp] = useState([
    { name: "Private", selected: true },
    { name: "Public", selected: false },
  ]);
  const onSelect = (index) => {
    const temp = p;
    temp.map((item, ind) => {
      if (index == ind) {
        if (item.selected == true) {
          item.selected = false;
        } else {
          item.selected = true;
          sets(index);
        }
      } else {
        item.selected = false;
      }
    });
    let temp2 = [];
    temp.map((item) => {
      temp2.push(item);
    });
    setp(temp2);
  };
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

  const [date, setDate] = useState(new Date("April-20-2000"));

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

  const showDatepicker = () => {
    showMode("date");
  };
  const d = new Date("July 21, 1983 01:15:00");

  const [text, onChangeText] = React.useState("");

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
  }, []);

  return (
    <CustomBubble
      bubbleColor={Colors.brown}
      crossColor={Colors.pink}
      navigation={navigation}
    >
      <View style={styles.root}>
        <Text style={styles.fontDesign}>{"Create \n Event"}</Text>
        <View style={styles.anRoot}>
          <Text style={styles.fontDesign}>Name </Text>
          <TextInput
            textAlign="center"
            cursorColor={Colors.brown}
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
          />
        </View>
        <View style={styles.anRoot}>
          <Text style={styles.fontDesign}>Date </Text>
          <Pressable
            // style={styles.input}
            onPress={showDatepicker}
            title="Pick Date"
          >
            <View style={{ flexDirection: "row" }}>
              <View style={[styles.dateIn, { height: 25, width: 30 }]}>
                <Text style={styles.fontDesign1}>
                  {date.getDate().toLocaleString()}
                </Text>
              </View>
              <View style={[styles.dateIn, { height: 25, width: 40 }]}>
                <Text style={styles.fontDesign1}>
                  {date.getFullYear().toLocaleString()}
                </Text>
              </View>
              <View style={[styles.dateIn, { height: 25, width: 50 }]}>
                <Text style={styles.fontDesign1}>
                  {month[date.getMonth().toLocaleString()]}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={{ marginTop: size / 13, flexDirection: "row" }}>
          <Text style={styles.fontDesign}>Privacy </Text>
          <View style={{ flexDirection: "column" }}>
            <FlatList
              data={p}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.lanItem,
                      {
                        borderColor:
                          item.selected == true ? Colors.orange : Colors.black,
                      },
                    ]}
                    onPress={() => {
                      onSelect(index);
                    }}
                  >
                    {item.selected == true ? (
                      <Image
                        source={require("../assets/radio-button.png")}
                        style={styles.icon}
                      />
                    ) : (
                      <Image
                        source={require("../assets/radio.png")}
                        style={styles.icon}
                      />
                    )}

                    <Text style={{ marginLeft: 20, fontSize: 20 }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        <Pressable
          style={[styles.dateIn, { height: 25, width: 50 }]}
          onPress={() => {
            alert("Successfully Added Event");
            navigation.navigate("HomePage");
          }}
        >
          <Text style={styles.fontDesign1}>Set</Text>
        </Pressable>
      </View>
    </CustomBubble>
  );
}
export default CreateEventScreen;

const styles = StyleSheet.create({
  root: {
    marginTop: size / 13,

    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  anRoot: {
    marginTop: size / 13,
    flexDirection: "row",

    alignItems: "center",
  },
  fontDesign: {
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 24,
  },
  fontDesign1: {
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
    height: 40,
    color: Colors.pink,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: 16,
    height: 16,
  },
  input: {
    height: 25,
    width: size / 2.5,
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
