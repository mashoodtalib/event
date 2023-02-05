import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomBubble from "../../components/Custom-Bubble";
import Colors from "../../constants/colors";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
import axios from "axios";
import { language } from "../../constants/language";
import { Path, Svg } from "react-native-svg";
import apis from "../../constants/static-ip";

export default function AllFriends({ navigation, route }) {
  const [error, setError] = useState(null);
  const [userdataagain, setUserdataagain] = React.useState([]);
  // const { data } = route.params;
  const [selectLan, setSelectLan] = useState(0);

  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")));
  };
  const [array, setArray] = useState(null);
  const fetchArray = async () => {
    try {
      await AsyncStorage.getItem("user")
        .then(async (value) => {
          //    console.log(JSON.parse(value).user.email);
          fetch(apis + `${JSON.parse(value).user.userName}`)
            .then((res) => res.json())
            .then((dat) => {
              setArray(dat);
              // console.log("data", dat);
            });
        })
        .catch((err) => {
          setError(err);
        });
    } catch (err) {
      setError(err);
      //  console.log(err);
    }
  };
  useEffect(() => {
    // console.log(data);
    getLang();

    fetchArray();
  }, []);
  useEffect(() => {
    if (array) {
      let allData = array.following.concat(array.followers);

      let uniqueData = allData.filter(
        (value, index, self) => self.indexOf(value) === index
      );

      console.log(uniqueData);

      uniqueData.forEach((item) => {
        //  console.log(item);
        const fetchData2 = async () => {
          try {
            const res = await fetch(apis + `otheruserdata`, {
              method: "POST",

              body: JSON.stringify({ email: item }),

              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            //  console.log(data);

            setUserdataagain((prevData2) => [...prevData2, data]);
          } catch (err) {
            //  console.error(err);
            setError(err);
          }
        };
        fetchData2();
      });
    }
  }, [array]);
  // useEffect(() => {
  //   if (array) {
  //     array.followers.forEach((item) => {
  //       console.log(item);
  //       const fetchData2 = async () => {
  //         try {
  //           const res = await fetch(apis + `otheruserdata`, {
  //             method: "POST",

  //             body: JSON.stringify({ email: item }),

  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           });
  //           const data = await res.json();
  //           console.log(data);

  //           setUserdataagain((prevData2) => [...prevData2, data]);
  //         } catch (err) {
  //           console.error(err);
  //           setError(err);
  //         }
  //       };
  //       fetchData2();
  //     });
  //   }
  // }, [array]);

  if (error) {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Error: {error.message}
        </Text>
      </View>
    );
  }
  if (!array) {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
  if (!userdataagain) {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  function Item({ item, index }) {
    console.log(item);
    return (
      <View
        style={[
          { marginLeft: 30 },
          { marginTop: 30 },
          index % 2 ? styles.secondColumn : styles.firstcolumn,
        ]}
      >
        <Pressable
          onPress={() => navigation.navigate("Messages", { data: item })}
        >
          <Image
            style={{
              height: 90,
              width: 90,
              tintColor: index % 2 ? Colors.brown : Colors.orange,
            }}
            source={require("../../assets/chat-bubll.png")}
          />
          {item.user.profile_pic_name === "" ? (
            <Ionicons
              style={{
                marginTop: 10,
                textAlign: "center",

                left: 14,
                overflow: "hidden",
                right: 14,
                position: "absolute",
              }}
              name={"person-circle-outline"}
              color={Colors.white}
              size={28}
            />
          ) : (
            <Image
              style={{
                marginTop: 10,
                overflow: "hidden",

                left: 30,
                right: 30,
                position: "absolute",
                width: "30%",
                height: "30%",
                borderRadius: 360,
              }}
              source={{ uri: item.user.profile_pic_name }}
            />
          )}
          <Text
            style={[
              {
                marginTop: 30,
                color: Colors.black,
                textAlign: "center",
                fontFamily: "GothicA1-Medium",
                left: 14,
                top: 11,
                overflow: "hidden",
                right: 14,
                fontSize: 12,
                position: "absolute",
              },
            ]}
          >
            @{item.user.userName}
          </Text>
        </Pressable>
      </View>
    );
  }
  return (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      <View style={styles.container}>
        <Text
          style={[
            {
              // marginLeft: 44,
              marginTop: 38,
              fontSize: 28,
              color: Colors.white,
              fontFamily: "GothicA1-Regular",
            },
          ]}
        >
          {selectLan == 0 ? language[0].eng : language[0].arab}
        </Text>
      </View>
      <View style={styles.container}>
        <FlatList
          style={styles.userlists}
          data={userdataagain}
          numColumns={2}
          keyExtractor={(_, item) => item}
          renderItem={({ item, index }) => {
            return <Item item={item} index={index} />;
          }}
        />
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: 45,
  },
  userlists: {
    width: "100%",
    marginTop: 20,
    alignContent: "center",
    height: "55%",
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  secondColumn: {
    marginTop: 45,
  },
  firstcolumn: {
    marginTop: 15,
  },
  bubble: {
    alignItems: "center",
    padding: 10,
  },
});
