import React, { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Pressable,
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
import ChangedBio from "./change-bio";
import ChangedLinks from "./change-links";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function ProfileBubble({ navigation, route }) {
  const [userdata, setUserdata] = React.useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [image, setImage] = useState(null);
  //const { data } = route.params;
  const [loading, setLoading] = useState(false);
  // const { default: exampleImage } = import("../uploads/" + data);
  //const exampleImageUri = Image.resolveAssetSource(exampleImage).uri;
  useEffect(() => {
    // oldData();
    // oldImage();
    // console.log(data);
  }, []);
  // const [data, setData] = useState(null);
  // let base64String = "";
  // const oldData = async () => {
  //   await AsyncStorage.getItem("user")
  //     .then((value) => {
  //       fetch(apis + "getImage", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ userId: JSON.parse(value).user._id }),
  //       })
  //         .then((res) => setData(res.json()))
  //         .catch((err) => console.log(err, "it has an error"));
  //     })
  //     .catch((err) => alert(err));
  //   // base64String = Buffer(
  //   //   String.fromCharCode(...new Uint8Array(data.image.data.data))
  //   // );
  //   console.log("aaaaaaaaaaaa", data);
  //   console.log("bbb", data.image);
  //   //   console.log("bb", base64String);
  // };
  // const oldImage = async () => {
  //   AsyncStorage.getItem("img")
  //     .then((data) => {
  //       setImage(data);
  //       console.log("img", image);
  //     })
  //     .catch((err) => alert(err));
  // };
  const loaddata = async () => {
    //console.log(userdata.profile_pic_name);

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
              //   console.log("hhhhhhhhh", save);

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
  //console.log("http://192.168.100.7:3000/" + userdata.profile_pic_name);

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // console.log(
    //   apis + `E:/React-Project/event/assets/` + userdata.profile_pic_name
    // );
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
    loaddata();
    // console.log(apis + `..uploads/${userdata.profile_pic_name}`);
  }, []);
  // useEffect(() => {
  //   const imagePath = "E:\\React-Project\\event\\uploads\\" + data;
  //   setImageUrl({ uri: imagePath });
  //   console.log(imagePath);
  // }, [route]);
  if (!userdata) {
    return <ActivityIndicator />;
  }

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
          <Text style={[styles.fonts, { color: Colors.brown }]}>
            @{userdata.userName}
          </Text>
          <Text
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={[styles.fonts, { color: Colors.white }]}
          >
            {userdata.bio === "" ? "bio" : userdata.bio}
          </Text>
          <Text
            onPress={() => {
              setModalVisible1(!modalVisible);
            }}
            style={[styles.fonts, { color: Colors.brown }]}
          >
            {userdata.links === "" ? "links" : userdata.links}
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
          {userdata.profile_pic_name === "" ? (
            <Ionicons
              name={"image-outline"}
              color={Colors.white}
              size={40}
              onPress={() => navigation.navigate("UploadProfile")}
            />
          ) : (
            // <TouchableOpacity
            //   onPress={() => navigation.navigate("UploadProfile")}
            // >
            <Pressable
              style={{ width: "100%", height: "100%", borderRadius: 360 }}
              onPress={() => navigation.navigate("UploadProfile")}
            >
              <Image
                style={{ width: "100%", height: "100%", borderRadius: 360 }}
                source={{ uri: userdata.profile_pic_name }}
              />
            </Pressable>
            /* //</TouchableOpacity> */
          )}
          {/* <TouchableOpacity onPress={pickImage}>
            {imageUrl && (
              <Image
                source={{ imageUrl }}
                style={{ width: 100, height: 100 }}
              />
            )}
          </TouchableOpacity> */}
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
      <ChangedBio
        navigation={navigation}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <ChangedLinks
        navigation={navigation}
        modalVisible1={modalVisible1}
        setModalVisible1={setModalVisible1}
      />
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
