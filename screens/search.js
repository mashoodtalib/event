import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../constants/colors";
import CustomBubble from "../components/Custom-Bubble";
import UserCard from "../components/userCard";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

const SearchUserPage = ({ navigation }) => {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const getallusers = async () => {
    if (keyword.length > 0) {
      setLoading(true);
      fetch("http://192.168.100.7:3000/searchuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: keyword }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            setData([]);
            setError(data.error);
            setLoading(false);
          } else if (data.message == "User Found") {
            setError(null);
            setData(data.user);
            setLoading(false);
          }
        })
        .catch((err) => {
          setData([]);
          setLoading(false);
        });
    } else {
      setData([]);
      setError(null);
    }
  };

  useEffect(() => {
    getallusers();
  }, [keyword]);
  return (
    <CustomBubble
      bubbleColor={Colors.orange}
      crossColor={Colors.pink}
      navigation={navigation}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search By Username.."
          onChangeText={(text) => {
            setKeyword(text);
          }}
        />

        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <>
            {error ? (
              <Text>{error}</Text>
            ) : (
              <ScrollView style={styles.userlists}>
                {data.map((item, index) => {
                  return (
                    <UserCard
                      key={item.username}
                      user={item}
                      navigation={navigation}
                    />
                  );
                })}
              </ScrollView>
            )}
          </>
        )}
      </View>
    </CustomBubble>
  );
};

export default SearchUserPage;

const styles = StyleSheet.create({
  input: {
    height: 25,
    width: size / 1.5,
    fontWeight: "500",
    fontFamily: "GothicA1-Bold",
    backgroundColor: Colors.pink,
    borderRadius: 24,
    textAlign: "center",
    borderColor: Colors.pink,

    color: Colors.white,
    borderBottomColor: Colors.pink,

    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderBottomColor: "#000",

    overflow: "hidden",
  },
  container: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: 42,
    paddingVertical: 85,
  },
  userlists: {
    width: "100%",
    marginTop: 20,
  },
});
