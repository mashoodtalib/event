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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://192.168.100.7:3001");
import CustomBubble from "../../components/Custom-Bubble";
import Colors from "../../constants/colors";
import apis from "../../constants/static-ip";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function Message({ navigation, route }) {
  const { data } = route.params;
  const [error, setError] = useState(null);

  const [ouruserdata, setOuruserdata] = React.useState(null);
  const [fuserdata, setFuserdata] = React.useState(null);

  const [userid, setUserid] = React.useState(null);
  const [roomid, setRoomid] = React.useState(null);
  const [chat, setChat] = React.useState([""]);

  // OUR ID & ROOM ID FOR SOCKET.IO

  useEffect(() => {
    loaddata();
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("recieved message - ", data);
      loadMessages(roomid);
    });
  }, [socket]);

  const sortroomid = (id1, id2) => {
    if (id1 > id2) {
      return id1 + id2;
    } else {
      return id2 + id1;
    }
  };

  useEffect(() => {
    loadMessages(roomid);
  }, [chat]);

  const loaddata = async () => {
    await AsyncStorage.getItem("user")
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
          .then((dat) => {
            if (dat.message == "User Found") {
              console.log("our user data ", dat.user.userName);
              setOuruserdata(dat.user);
              setUserid(dat.user._id);

              fetch(apis + "otheruserdata", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.user.email }),
              })
                .then((res) => res.json())
                .then(async (data1) => {
                  if (data1.message == "User Found") {
                    console.log("fuser data ", data1.user.userName);
                    setFuserdata(data1.user);
                    let temproomid = await sortroomid(
                      data.user._id,
                      dat.user._id
                    );

                    setRoomid(temproomid);
                    console.log("room id ", temproomid);
                    socket.emit("join_room", { roomid: temproomid });
                    loadMessages(temproomid);
                  } else {
                    alert("User Not Found");
                    navigation.navigate("HomePage");
                    // navigation.navigate('Login')
                  }
                })
                .catch((e) => setError(e))
                .catch((err) => {
                  // console.log(err)
                  alert("Something Went Wrong");
                  navigation.navigate("HomePage");
                });
            } else {
              alert("Login Again");
              navigation.navigate("Login");
            }
          })
          .catch((err) => {
            navigation.navigate("Login");
          });
      })
      .catch((err) => {
        navigation.navigate("Login");
      });
  };
  const sendMessage = async () => {
    const setmessagedata = {
      lastmessage: currentmessage,
      roomid: roomid,
      ouruserid: userid,
      fuserid: fuserdata._id,
    };
    const messagedata = {
      message: currentmessage,
      roomid: roomid,
      senderid: userid,
      recieverid: fuserdata._id,
    };
    fetch(apis + "savemessagetodb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagedata),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Message saved successfully") {
          socket.emit("send_message", messagedata);
          loadMessages(roomid);
          console.log("message sent");

          setCurrentmessage("");
          fetch(apis + "setusermessages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(setmessagedata),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.message == "Message saved successfully") {
                console.log("message saved");
              } else {
                alert("Network Error");
              }
            });
        } else {
          alert("Network Error");
          setCurrentmessage("");
        }
      })
      .catch((e) => setError(e))
      .catch((err) => {
        console.log(err);
      });
  };

  const [currentmessage, setCurrentmessage] = React.useState(null);

  const loadMessages = (temproomid) => {
    fetch(apis + "getmessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomid: temproomid }),
    })
      .then((res) => res.json())

      .then((data) => {
        setChat(data);
      })
      .catch((e) => setError(e));
  };
  if (error) {
    return <Text>An error occurred: {error.message}</Text>;
  }

  if (!ouruserdata) {
    return (
      <ActivityIndicator
        style={{ flexDirection: "column", alignItems: "center" }}
      />
    );
  }
  if (!fuserdata) {
    return (
      <ActivityIndicator
        style={{ flexDirection: "column", alignItems: "center" }}
      />
    );
  }

  return (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      <View style={[styles.container]}>
        <Text
          style={[
            {
              // marginLeft: 44,
              marginTop: 38,
              textAlign: "center",
              fontSize: 28,
              color: Colors.brown,
              fontFamily: "GothicA1-Regular",
            },
          ]}
        >
          {data.user.userName}
        </Text>
        <ScrollView style={styles.messageView}>
          {chat.map((item, index) => {
            return (
              <View style={styles.message} key={index}>
                {item.senderid == userid && (
                  <View style={styles.messageRight}>
                    <Ionicons
                      style={{
                        marginVertical: 10,
                      }}
                      name="person-circle-outline"
                      color={Colors.white}
                      size={38}
                    />
                    <Text style={styles.messageTextRight}>{item.message}</Text>
                  </View>
                )}
                {item.senderid != userid && item != "" && (
                  <View style={styles.messageLeft}>
                    <Ionicons
                      style={{
                        marginVertical: 10,
                      }}
                      name="person-circle-outline"
                      color={Colors.white}
                      size={38}
                    />
                    <Text style={styles.messageTextLeft}>{item.message}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TextInput
            style={styles.input}
            onChangeText={(text) => setCurrentmessage(text)}
            value={currentmessage}
          />
          {currentmessage ? (
            <Ionicons
              name="send"
              color={Colors.pink}
              size={22}
              onPress={() => sendMessage()}
            />
          ) : (
            <Ionicons name="send" color={Colors.white} size={22} />
          )}
        </View>
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 25,
    width: size / 2,
    fontWeight: "500",
    fontFamily: "GothicA1-Bold",
    backgroundColor: Colors.pink,
    borderRadius: 24,
    textAlign: "center",
    borderColor: Colors.pink,
    marginHorizontal: 10,
    color: Colors.white,
    borderBottomColor: Colors.pink,
    padding: 4,
    borderBottomColor: "#000",

    overflow: "hidden",
  },
  container: {
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
  message: {
    width: "100%",
    // padding:10,
    borderRadius: 10,
    // marginVertical:5,
    // backgroundColor:'red',
  },
  messageView: {
    width: "100%",
    height: "60%",
  },
  messageRight: {
    width: "90%",
    alignItems: "flex-start",
    flexDirection: "row-reverse",
    // backgroundColor:'red'
  },
  messageTextRight: {
    color: "white",
    backgroundColor: Colors.pink, // width:'min-content',
    minWidth: 100,
    padding: 10,
    fontSize: 17,
    marginLeft: 15,

    borderRadius: 20,
    margin: 10,
  },
  messageLeft: {
    flexDirection: "row",
    width: "90%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    // backgroundColor:'red'
  },
  messageTextLeft: {
    color: "white",
    backgroundColor: Colors.brown,

    fontSize: 17,
    minWidth: 100,
    padding: 10,
    borderRadius: 20,
    margin: 10,
  },
});
