import {
  View,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Device from "expo-device";

import * as Notifications from "expo-notifications";
import Colors from "../constants/colors";
import * as React from "react";
import PrimaryButton from "../components/Primary-Button";
import LinearGradientComponent from "../components/Linear-Gradient-component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis from "../constants/static-ip";
import { Image } from "react-native";
const { width, height } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const [toggle, setToggle] = React.useState(false);
  const [name, setName] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [email, setemail] = React.useState("");
  const [userName, setuserName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  // const [fdata, setFdata] = React.useState({
  //   name: "",
  //   password: "",
  //   email: "",
  //   userName: "",
  // });
  // const [ldata, setLdata] = React.useState({
  //   password: "",
  //   userName: "",
  // });

  const [saveNot, issaveNot] = React.useState("");
  const [expoPushToken, setExpoPushToken] = React.useState("");
  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
  }, []);
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      issaveNot(token);
      // console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }
  const [errormsg, setErrormsg] = React.useState(null);

  const handleSubmit = () => {
    if (userName == "" || name == "" || email == "" || password == "") {
      setErrormsg("All fields are required");
      return;
    } else {
      if (name == userName) {
        setErrormsg("Name and Username must not be same");
        return;
      } else {
        // setLoading(true);
        fetch(apis + "signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            password: password,
            email: email,
            userName: userName,
            deviceToken: saveNot,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            // console.log(data);
            if (data.message == "Invalid email address") {
              Alert.alert("Invalid email address");
            } else if (data.error) {
              // alert('Invalid Credentials')
              // setLoading(false);
              setErrormsg(data.error);
            } else if (data.message == "Email or userName Already exist") {
              Alert.alert("Email or userName Already exist");
            } else {
              // console.log(data.udata);
              Alert.alert("User Register Successfully.Now do Login");
              // setLoading(false);

              navigation.navigate("Login");
            }
          })
          .catch(function (error) {
            console.log(
              "There has been a problem with your fetch operation: " +
                error.message
            );
            // ADD THIS THROW error
            throw error;
          });
      }
    }
  };
  function changeToggle(toggle) {
    setToggle(toggle);
  }
  function onScreenChange() {
    navigation.navigate("HomePage");
  }

  return (
    <LinearGradientComponent>
      <SafeAreaView style={styles.rootScreen}>
        <Image
          style={{ height: "10%", width: "60%" }}
          source={require("../assets/OndoPrimary1.png")}
        />
        <View style={styles.textInputField}>
          <Text style={styles.text}>Play</Text>
          <Text style={styles.textLife}>Your Life</Text>
        </View>
        {errormsg ? <Text style={styles.errormessage}>{errormsg}</Text> : null}
        <TextInput
          onSubmitEditing={() => {
            handleSubmit();
          }}
          style={styles.input}
          onPressIn={() => setErrormsg(null)}
          onChangeText={(texts) => setuserName(texts)}
          placeholder="Username"
          autoCorrect={false}
        />
        <TextInput
          onSubmitEditing={() => {
            handleSubmit();
          }}
          style={styles.input}
          onPressIn={() => setErrormsg(null)}
          onChangeText={(text) => setName(text)}
          placeholder="Full Name"
          autoComplete="name"
          autoCapitalize="words"
        />
        <TextInput
          onSubmitEditing={() => {
            handleSubmit();
          }}
          style={styles.input}
          onPressIn={() => setErrormsg(null)}
          onChangeText={(text) => setemail(text)}
          placeholder="Email"
          autoComplete="email"
          keyboardType="email-address"
        />
        <TextInput
          onSubmitEditing={() => {
            handleSubmit();
          }}
          style={styles.input}
          onPressIn={() => setErrormsg(null)}
          onChangeText={(texts) => setpassword(texts)}
          placeholder="Password"
          secureTextEntry={true}
          autoComplete="password"
        />
        <PrimaryButton
          onPress={() => {
            handleSubmit();
          }}
        >
          Register
        </PrimaryButton>
        <Pressable onPress={() => {}}>
          <Text style={(styles.accountText, { marginTop: 50 })}>
            {"Already have an account?"}
          </Text>
        </Pressable>
        <View style={styles.buttonOuterContainer}>
          <Pressable
            style={({ pressed }) =>
              pressed
                ? [styles.buttonInnerContainer, styles.pressed]
                : styles.buttonInnerContainer
            }
            onPress={() => {
              navigation.navigate("Login", { disabledAnimation: true });
            }}
            android_ripple={{ color: Colors.highLightPurple }}
          >
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        </View>
        {/* <Text>{JSON.stringify({ name, userName, email, password })}</Text> */}
      </SafeAreaView>
    </LinearGradientComponent>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  textLife: {
    fontFamily: "GothicA1-Bold",
    fontSize: 30,
    color: Colors.orange,
    marginBottom: 10,
  },
  textInputField: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "GothicA1-Bold",
    fontSize: 30,
    color: Colors.pink,
  },
  input: {
    height: 40,
    width: width * 0.7,
    fontFamily: "GothicA1-Medium",
    margin: 10,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.pink,
  },
  forgotText: {
    fontFamily: "GothicA1-SemiBold",
  },
  accountText: {
    fontFamily: "PathwayGothicOne-Regular",
    marginTop: 50,
  },
  buttonOuterContainer: {
    borderRadius: 28,
    width: width * 0.25,
    marginTop: 8,

    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    color: Colors.brown,
    textAlign: "center",
    fontFamily: "GothicA1-Regular",
  },
  pressed: {
    opacity: 0.75,
  },
  errormessage: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    backgroundColor: "#F50057",
    padding: 5,
    borderRadius: 10,
  },
});
