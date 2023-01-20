import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator ,
  TouchableOpacity,
} from "react-native";
import CustomBubble from "../components/Custom-Bubble";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import apis from "../constants/static-ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
const numColumns = width > 600 ? 3 : 2;
export default function Events() {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const [text, onChangeText] = React.useState("");
  const [load, setIsLoad] = useState(false);
  const navigation = useNavigation();

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
      console.log(text);
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
        <FlatList
          data={text}
          keyExtractor={(item , index) => item.id}
          renderItem={({ item , index}) => (
            <TouchableOpacity
            onPress={() =>
            navigation.navigate("EventDetails", { item: item })}>
            <View style={styles.anRoot}>
              <View style={index%2 == 0 ? styles.sm_bubble : [styles.sm_bubble, { backgroundColor: '#423242' }]}

              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    margin: 5,
                  }}
                >
                  <Ionicons
                    name="person-circle"
                    size={28}
                    color={Colors.white}
                    />
                  <Text style={styles.fontDesn}>{item.name}</Text>
                  <Text style={styles.fontDesn}>{item.date.substring(0,10)}</Text>
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
    overflow: 'scroll'
},
  anRoot: {
    padding: 12,
  },
  sm_bubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.pink,
    alignItems: "center",
    justifyContent: "center",
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

    color: Colors.white,
    fontSize: 24,
  },
  fontDesn: {
    fontFamily: "GothicA1-Regular",

    color: Colors.white,
    fontSize: 9,
  },
});
