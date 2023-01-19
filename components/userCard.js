import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserCard = ({ user, navigation }) => {
  // console.log('userdata ', userdata)

  // console.log(user)
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("Other_UserProfile", { user: user });
      }}
    >
      <View style={styles.ChatCard}>
        {/* {user.profile_pic ? (
          <Image source={{ uri: user.profile_pic }} style={styles.image} />
        ) : (
          <Ionicons name={"person-outline"} color={Colors.white} size={44} />
        )} */}

        <View style={styles.c1}>
          <Text style={styles.username}>{user.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  ChatCard: {
    backgroundColor: Colors.pink,
    width: "100%",
    marginTop: 10,
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  c1: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-between",
  },
  lastmessage: {
    color: "gray",
    fontSize: 19,
  },
});
