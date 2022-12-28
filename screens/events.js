import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import CustomBubble from "../components/Custom-Bubble";
import Colors from "../constants/colors";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
export default function Events({ navigation }) {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
  }, []);
  return (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      <View style={styles.root}>
        <Text style={styles.fontDesign}>{"Events"}</Text>
      </View>
      {/* <View style={styles.anRoot}>
          <Text style={styles.fontDesign}>Name </Text>
          <TextInput
            textAlign="center"
            cursorColor={Colors.thirdBubble}
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
          />
        </View>
        <View style={styles.anRoot}>
          <Text style={styles.fontDesign}>{texts1} </Text>
          <Pressable onPress={() => showMode("date")}>
            <View style={styles.input}></View>
          </Pressable>
        </View>

        <View style={styles.anRoot}>
          <Text style={styles.fontDesign}>Name </Text>
          <TextInput
            textAlign="center"
            cursorColor={Colors.thirdBubble}
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
          />
        </View>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display="default"
          is24Hour={true}
          onChange={onChange}
        />
      )} 
      */}
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  anRoot: {
    marginTop: size / 11,
    flexDirection: "row",

    alignItems: "center",
  },
  fontDesign: {
    fontFamily: "GothicA1-Regular",

    color: Colors.white,
    fontSize: 24,
  },
});
