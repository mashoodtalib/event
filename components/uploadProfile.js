import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";

import Colors from "../constants/colors";
import CustomBubble from "../components/Custom-Bubble";
import * as ImagePicker from "expo-image-picker";
import apis from "../constants/static-ip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

const UploadProfile = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState("");
  const [progress, setProgress] = useState(0);

  const openImageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }

    if (status === "granted") {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!response.canceled) {
        // setProfileImage(response.assets[0]);
        console.log(response.assets[0].uri);
        // console.log(response.assets[0].uri);
        setProfileImage(response.assets[0].uri);
        //   AsyncStorage.setItem("img", response.assets[0].uri);
      }
    }
  };
  const uploadProfileImage = async () => {
    await AsyncStorage.getItem("user").then(async (value) => {
      const formData = new FormData();
      // formData.append("image", profileImage);
      //  AsyncStorage.setItem("img", profileImage)
      formData.append("image", {
        uri: profileImage,
        type: "image/png",
        name: Date.now().toFixed(10) + "image.png",
      });
      // formData.append("userId", JSON.parse(value).user._id);
      formData.append("email", JSON.parse(value).user.email);
      formData.append("name", profileImage);
      try {
        const response = await fetch(apis + "uploadimage", {
          body: formData,
          method: "POST",
          headers: {
            //   Accept: "application/json",
            "Content-Type": "multipart/form-data",
            //  authorization: `JWT ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          Alert.alert("Image Uploaded Successfully");
          const parsedUserData = JSON.parse(value);
          console.log(parsedUserData.user.profile_pic_name);
          parsedUserData.user.profile_pic_name = profileImage;
          await AsyncStorage.setItem("user", JSON.stringify(parsedUserData));
          navigation.navigate("HomePage");

          console.log("data", data);
        }

        // .then((res) =>
        //   res.json().then((data) => {
        //     console.log(data);
        //   })
        // )
        // .catch((err) => {
        //   console.log("err", err);
        // });

        //   if (res.data.success) {
        //     props.navigation.dispatch(StackActions.replace("UserProfile"));
        //   }
      } catch (error) {
        console.log(error.message);
      }
    });
  };

  return (
    <CustomBubble
      bubbleColor={Colors.pink}
      crossColor={Colors.orange}
      navigation={navigation}
    >
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={openImageLibrary}
            style={styles.uploadBtnContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={styles.uploadBtn}>Upload Profile Image</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.skip}>Skip</Text>
          {profileImage ? (
            <Text
              onPress={uploadProfileImage}
              style={[
                styles.skip,
                {
                  backgroundColor: Colors.dark,
                  color: "white",
                  borderRadius: 8,
                },
              ]}
            >
              Upload
            </Text>
          ) : null}
        </View>
      </View>
    </CustomBubble>
  );
};

export default UploadProfile;

// const styles = StyleSheet.create({
//   input: {
//     height: 25,
//     width: size / 1.5,
//     fontWeight: "500",
//     fontFamily: "GothicA1-Bold",
//     backgroundColor: Colors.pink,
//     borderRadius: 24,
//     textAlign: "center",
//     borderColor: Colors.pink,

//     color: Colors.white,
//     borderBottomColor: Colors.pink,

//     alignItems: "center",
//     alignContent: "center",
//     justifyContent: "center",
//     borderBottomColor: "#000",

//     overflow: "hidden",
//   },
//   container: {
//     alignContent: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "column",
//     marginHorizontal: 42,
//     paddingVertical: 85,
//   },
//   userlists: {
//     width: "100%",
//     marginTop: 20,
//   },

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBtnContainer: {
    height: 125,
    width: 125,
    borderRadius: 125 / 2,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
  },
  uploadBtn: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.3,
    fontWeight: "bold",
  },
  skip: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    opacity: 0.5,
  },
});
