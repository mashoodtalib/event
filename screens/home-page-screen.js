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
} from "react-native";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import Bubble from "../components/Bubble";
import { language } from "../constants/language";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
function HomePage({ navigation, route }) {
  const [selectLan, setSelectLan] = useState(0);
  const { data } = route.params;
  AsyncStorage.getItem("user")
    .then((data) => {
      // console.log("data", data);
    })
    .catch((err) => alert(err));

  useEffect(() => {
    getLang();
    console.log("data", data);
  }, []);

  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")));
  };

  return (
    <View style={styles.root}>
      <Bubble
        onpress={() =>
          navigation.navigate(
            "allFriends",
            { data: data },

            { disabledAnimation: true }
          )
        }
        bubbleStyle={{ position: "absolute", top: 85, left: -7, zIndex: 1 }}
        styleBubble={{
          backgroundColor: Colors.dark,

          height: 190,
          width: width < 450 ? 190 : 190,
        }}
        iconName={"md-chatbubble-ellipses-outline"}
        textMessage={selectLan == 0 ? language[0].eng : language[0].arab}
        iconSize={48}
        iconColor={Colors.pink}
        textStyle={styles.text}
      />
      <Bubble
        onpress={() => navigation.push("Settings", { disabledAnimation: true })}
        bubbleStyle={{ top: 45, position: "absolute", zIndex: 1, right: 24 }}
        styleBubble={{
          backgroundColor: Colors.orange,

          height: 130,
          width: width < 450 ? 130 : 130,
        }}
        iconName={"md-settings-outline"}
        textMessage={selectLan == 0 ? language[1].eng : language[1].arab}
        iconSize={42}
        iconColor={Colors.dark}
        textStyle={styles.textone}
      />
      <Bubble
        onpress={() =>
          navigation.push("CreateEvent", { disabledAnimation: true })
        }
        bubbleStyle={{ top: 200, position: "absolute", zIndex: 1, right: -35 }}
        styleBubble={{
          backgroundColor: Colors.brown,

          height: 210,
          width: width < 450 ? 210 : 210,
        }}
        iconName={"add-sharp"}
        textMessage={selectLan == 0 ? language[2].eng : language[2].arab}
        iconSize={48}
        iconColor={Colors.dark}
        textStyle={styles.texttwo}
      />
      <Bubble
        onpress={() =>
          navigation.navigate("ProfileScreen", { disabledAnimation: true })
        }
        bubbleStyle={{ top: 305, position: "absolute", zIndex: 1, left: -30 }}
        styleBubble={{
          backgroundColor: Colors.pink,

          height: 210,
          width: width < 450 ? 210 : 210,
        }}
        iconName={"person-outline"}
        textMessage={selectLan == 0 ? language[3].eng : language[3].arab}
        iconSize={48}
        iconColor={Colors.brown}
        textStyle={styles.texttwo}
      />
      <Bubble
        onpress={() => navigation.push("Events", { disabledAnimation: true })}
        bubbleStyle={{ top: 445, position: "absolute", zIndex: 1, right: 2 }}
        styleBubble={{
          backgroundColor: Colors.dark,

          height: 160,
          width: width < 450 ? 160 : 160,
        }}
        iconName={"calendar-outline"}
        textMessage={selectLan == 0 ? language[4].eng : language[4].arab}
        iconSize={40}
        iconColor={Colors.orange}
        textStyle={styles.text}
      />
      <Bubble
        onpress={() => navigation.push("search", { disabledAnimation: true })}
        bubbleStyle={{ top: 530, position: "absolute", zIndex: 1, left: 25 }}
        styleBubble={{
          backgroundColor: Colors.orange,

          height: 140,
          width: width < 450 ? 140 : 140,
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    paddingTop: 8,
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
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
export default HomePage;
