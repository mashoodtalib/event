import React, { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis from "../../constants/static-ip";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
//   <Ionicons
//             onPress={UnfollowThisUser}
//             style={{
//               alignContent: "flex-end",
//               flexDirection: "row",
//               paddingLeft: 52,
//             }}
//             color={Colors.dark}
//             name={"ios-close-outline"}
//             size={40}
//           />
//           <Ionicons
//             onPress={FollowThisUser}
//             style={{
//               alignContent: "flex-end",
//               flexDirection: "row",
//             }}
//             color={Colors.orange}
//             name={"ios-checkmark-done"}
//             size={40}
//           />
export default function OtherUser({ navigation, route }) {
  const [userdata, setUserdata] = React.useState(null);
  const [issameuser, setIssameuser] = React.useState(false);

  const ismyprofile = (otheruser) => {
    AsyncStorage.getItem("user").then((loggeduser) => {
      const loggeduserobj = JSON.parse(loggeduser);
      if (loggeduserobj.user._id == otheruser._id) {
        setIssameuser(true);
        alert("Same User Found");
        navigation.push("search", { disabledAnimation: true });
      } else {
        setIssameuser(false);
      }
    });
  };
  const { user } = route.params;
  // console.log(user)
  const loaddata = async () => {
    console.log(user.email);
    fetch(apis + "otheruserdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "User Found") {
          setUserdata(data.user);
          ismyprofile(data.user);
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
  };

  const FollowThisUser = async () => {
    console.log("FollowThisUser");
    const loggeduser = await AsyncStorage.getItem("user");
    const loggeduserobj = JSON.parse(loggeduser);
    console.log(loggeduser);
    console.log(loggeduserobj);
    fetch(apis + "followuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followfrom: loggeduserobj.user.email,
        followto: userdata.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "User Followed") {
          console.log(data);
          alert("Followed");
          loaddata();
          setIsfollowing(true);
        } else {
          alert("Something Went Wrong");
          console.log(data);
        }
      });
  };

  const [isfollowing, setIsfollowing] = React.useState(false);
  const CheckFollow = async (otheruser) => {
    AsyncStorage.getItem("user").then((loggeduser) => {
      const loggeduserobj = JSON.parse(loggeduser);
      fetch(apis + "checkfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followfrom: loggeduserobj.user.email,
          followto: otheruser.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message == "User in following list") {
            setIsfollowing(true);
          } else if (data.message == "User not in following list") {
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
    fetch(apis + "unfollowuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followfrom: loggeduserobj.user.email,
        followto: userdata.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "User Unfollowed") {
          alert("User Unfollowed");
          loaddata();
          setIsfollowing(false);
        } else {
          alert("Something Went Wrong");
        }
      });
  };
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
    loaddata();
  }, []);
  return issameuser ? (
    <></>
  ) : userdata ? (
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
      />
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
          onPress={() => {
            setUserdata(null);
            navigation.push("search", { disabledAnimation: true });
          }}
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
          {/* {userdata.profile_pic === "" ? (
            <Ionicons name={"person-outline"} color={Colors.white} size={44} />
          ) : (
            <Image
              style={styles.profilepic}
              source={{ uri: userdata.profile_pic }}
            />
          )} */}
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
          {isfollowing ? (
            <Ionicons
              onPress={() => UnfollowThisUser()}
              name={"ios-close-outline"}
              color={Colors.white}
              size={24}
            />
          ) : (
            <Ionicons
              onPress={() => FollowThisUser()}
              name={"ios-checkmark"}
              color={Colors.white}
              size={24}
            />
          )}
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
