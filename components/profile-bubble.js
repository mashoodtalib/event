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
import apis from "../constants/static-ip";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function ProfileBubble({ navigation, route }) {
  const [userdata, setUserdata] = React.useState(null);
  const [image, setImage] = useState(null);
  const [save, setSave] = React.useState(null);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    oldData();
    // console.log(save.user.email);
  }, []);
  const oldData = async () => {
    await AsyncStorage.getItem("user")
      .then((data) => {
        setSave(data);
      })
      .catch((err) => alert(err));
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets);
      console.log(result.assets);
      handleUpload(result.assets);
    } else {
      console.log(error);
    }
  };

  const handleUpload = async (uri) => {
    setLoading(true);

    await AsyncStorage.getItem("user")
      .then(async (value) => {
        const formData = new FormData();

        formData.append("image", {
          uri,
        });
        formData.append("profile_pic_name", "image/png");
        formData.append("email", JSON.parse(value).user.email);
        //console.log(uri);
        console.log(JSON.parse(value).user.email);

        const options = {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        await fetch(apis + "uploadimage", options)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);

            if (data.message == "Image uploaded successfully") {
              console.log("userdata ", userdata);

              setUserdata(data.user);
            } else {
              alert("Something Wrong");
            }
          })
          .catch((err) => {
            alert("Something Went Wrong");
            console.log(err);
          });
      })
      .catch((err) => {
        alert(err);

        // navigation.push("ProfileScreen");
      });
  };
  const loaddata = async () => {
    AsyncStorage.getItem("user")
      .then(async (value) => {
        fetch(apis + "userdata", {
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
              console.log("hhhhhhhhh", save);

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

  if (!save) {
    return <ActivityIndicator />;
  }

  return userdata && save ? (
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
      >
        <Text
          style={{
            color: Colors.pink,
            paddingHorizontal: size / 3,
            paddingVertical: size / 5,
            fontSize: 24,
            fontFamily: "GothicA1-Medium",
          }}
        >
          Check
        </Text>
      </Animated.View>
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
              onPress={pickImage}
              name={"person-outline"}
              color={Colors.white}
              size={44}
            />
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <Image style={styles.profilepic} source={{ uri: image }} />
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
