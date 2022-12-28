import React, { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../firebase/config";
import * as ImagePicker from "expo-image-picker";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function ProfileBubble({ navigation, children }) {
  const [userdata, setUserdata] = React.useState(null);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // console.log(result)

    if (!result.assets) {
      const source = { uri: result.assets };
      setImage(source);

      const response = await fetch(result.assets);
      const blob = await response.blob();
      const filename = result.assets.substring(result.assets);

      const ref = firebase.storage().ref().child(filename);
      const snapshot = await ref.put(blob);
      const url = await snapshot.ref.getDownloadURL();

      // console.log(url)
      return url;
    } else {
      return null;
    }
  };

  const handleUpload = async () => {
    AsyncStorage.getItem("user").then((data) => {
      setLoading(true);
      console.log(data.user);
      pickImage().then((url) => {
        fetch("http://192.168.100.7:3000/setprofilepic", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: JSON.parse(data).user.email,
            profile_pic: url,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "Profile picture updated successfully") {
              setLoading(false);
              alert("Profile picture updated successfully");
              navigation.navigate("HomePage");
            } else if (data.error === "Invalid Credentials") {
              alert("Invalid Credentials");
              setLoading(false);
              navigation.navigate("HomePage");
            } else {
              setLoading(false);
              alert("Please Try Again");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  };
  const loaddata = async () => {
    AsyncStorage.getItem("user")
      .then(async (value) => {
        fetch("http://192.168.100.7:3000/userdata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(value).token,
          },
          body: JSON.stringify({ email: JSON.parse(value).user.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message == "User Found") {
              console.log("userdata ", userdata);
              setUserdata(data.user);
            } else {
              alert("Login Again");
              navigation.push("Login");
            }
          })
          .catch((err) => {
            navigation.push("Login");
          });
      })
      .catch((err) => {
        navigation.push("Login");
      });
  };

  console.log("userdata ", userdata);

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
    loaddata();
  }, []);
  return userdata ? (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.itemRadius,
          styles.styleBubble,
          {
            backgroundColor: Colors.dark,
            right: size / 3,
            bottom: size / 22.2 - 100,
          },

          { opacity: progress, transform: [{ scale }] },
        ]}
      ></Animated.View>
      <Animated.View
        style={[
          styles.icon,
          styles.itemRadiuses,
          styles.styleCrossBubble,
          { backgroundColor: Colors.brown },
          { opacity: progress, transform: [{ scale }] },
        ]}
      >
        <Ionicons
          name={"ios-close-outline"}
          color={Colors.white}
          size={44}
          onPress={() =>
            navigation.push("HomePage", { disabledAnimation: true })
          }
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.itemRadius,
          styles.styleBubble,
          {
            backgroundColor: Colors.pink,
            left: size / 3,
            top: size / 2.2,
            height: size / 2 + 100,
            width: size / 2 + 100,
          },

          { opacity: progress, transform: [{ scale }] },
        ]}
      >
        <View style={styles.userDetail}>
          <Text style={[styles.fonts, { color: Colors.black }]}>
            @{userdata.userName}
          </Text>
          <Text style={[styles.fonts, { color: Colors.white }]}>
            {userdata.bio}
          </Text>
          <Text style={[styles.fonts, { color: Colors.brown }]}>
            {userdata.links}
          </Text>
        </View>
        {/* //  <TouchableOpacity onPress={handleUpload}> */}
        <Animated.View
          style={[
            styles.innerCircle,
            styles.icon,
            styles.styleCrossBubble,
            { backgroundColor: Colors.orange },
            { opacity: progress, transform: [{ scale }] },
          ]}
        >
          {userdata.profile_pic === "" ? (
            <Ionicons
              onPress={handleUpload}
              name={"person-outline"}
              color={Colors.white}
              size={44}
            />
          ) : (
            <TouchableOpacity onPress={handleUpload}>
              <Image
                style={styles.profilepic}
                source={{ uri: userdata.profile_pic }}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
        {/* //  </TouchableOpacity> */}

        <Animated.View
          style={[
            styles.icon,

            styles.smallCircle,
            {
              backgroundColor: Colors.orange,
              right: size / 1.5 - 5,
              top: size / 8.7,
            },
            { opacity: progress, transform: [{ scale }] },
          ]}
        >
          <Ionicons
            name={"person-add-outline"}
            color={Colors.white}
            size={24}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.smallCircle,
            styles.icon,
            {
              backgroundColor: Colors.orange,
              right: size / 1.4 - 2,
              top: size / 3.2,
            },
            { opacity: progress, transform: [{ scale }] },
          ]}
        >
          <Ionicons
            name={"md-chatbubbles-sharp"}
            color={Colors.white}
            size={24}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.smallCircle,
            styles.icon,
            {
              backgroundColor: Colors.orange,
              right: size / 1.5 - 10,
              top: size / 1.9,
            },
            { opacity: progress, transform: [{ scale }] },
          ]}
        >
          <Ionicons name={"calendar-outline"} color={Colors.white} size={24} />
        </Animated.View>
      </Animated.View>
    </View>
  ) : (
    <ActivityIndicator />
  );
}

const styles = StyleSheet.create({
  userDetail: {
    flexDirection: "column",
    marginHorizontal: size / 4,
    marginTop: size / 5,
  },
  fonts: {
    fontSize: 24,
    fontFamily: "GothicA1-Medium",
  },
  smallCircle: {
    height: size / 8,
    width: size / 8,
    borderRadius: 360,
    position: "absolute",
    zIndex: -1,
  },
  innerCircle: {
    borderRadius: 360,
    position: "absolute",
    zIndex: -1,
    left: size / 4.1,
    height: size / 2 + 130,
    width: size / 2 + 130,
    bottom: size / 1.5,
  },
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  itemRadius: {
    borderRadius: 360,
  },
  styleBubble: {
    height: size / 2 + 130,
    width: size / 2 + 130,
    position: "absolute",
    zIndex: -1,
  },
  styleCrossBubble: {
    height: size / 4,
    width: size / 4,
  },
  itemRadiuses: {
    borderRadius: 360,
    position: "absolute",
    zIndex: -1,
    left: size / 16,
    top: size / 9,
  },
  profilepic: {
    alignItems: "center",
    alignContent: "center",

    width: 150,
    height: 150,
    borderRadius: 75,
    margin: 10,
  },
});
