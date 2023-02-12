import "react-native-gesture-handler";

import * as React from "react";

import { Button, StyleSheet, Text, View } from "react-native";
import Colors from "./constants/colors";
import { useCallback, useState } from "react";
import { useFonts } from "expo-font";
import LoginScreen from "./screens/login-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomePage from "./screens/home-page-screen";
import CreateEventScreen from "./screens/create-event-screen";
import Events from "./screens/events";
import RegisterScreen from "./screens/register-screen";
import Settings from "./screens/settings";

import LanSelector from "./screens/settings-pages/lanSelector";
import ProfileScreen from "./screens/profile-pages/profile-screren";
import YourAccount from "./screens/settings-pages/your-account";
import SearchUserPage from "./screens/search";
import OtherUser from "./screens/profile-pages/other-user";
import AllFriends from "./screens/all-chats/all-friends";
import Message from "./screens/all-chats/message";
import ProfileBubble from "./components/profile-bubble";
import SendEvents from "./screens/send-events";
import EventDetails from "./screens/event-details";
import UploadProfile from "./components/uploadProfile";
import SplashScreen from "./screens/splashScreen";
import ForgotPassword from "./screens/forgotPassword";
import ResetPass from "./screens/rese-pass";

const Stack = createNativeStackNavigator();
export default function AppWrapper() {
  return <App />;
}
function App() {
  const [fontsLoaded] = useFonts({
    "GothicA1-Bold": require("./fonts/GothicA1-Bold.ttf"),
    "GothicA1-Medium": require("./fonts/GothicA1-Medium.ttf"),
    "GothicA1-Regular": require("./fonts/GothicA1-Regular.ttf"),
    "GothicA1-SemiBold": require("./fonts/GothicA1-SemiBold.ttf"),
    "Montserrat-Italic-VariableFont_wght": require("./fonts/Montserrat-Italic-VariableFont_wght.ttf"),
    "Montserrat-VariableFont_wght": require("./fonts/Montserrat-VariableFont_wght.ttf"),
    "PathwayGothicOne-Regular": require("./fonts/PathwayGothicOne-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="Account"
          component={YourAccount}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Events"
          component={Events}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LanSelector"
          component={LanSelector}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileBubble}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="search"
          component={SearchUserPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Other_UserProfile"
          component={OtherUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="allFriends"
          component={AllFriends}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Messages"
          component={Message}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendEvents"
          component={SendEvents}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventDetails"
          component={EventDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UploadProfile"
          component={UploadProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPass"
          component={ResetPass}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
