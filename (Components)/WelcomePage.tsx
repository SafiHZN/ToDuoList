import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { Button } from "react-native-elements";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

const staticImage = require("../assets/favicon.png");
export const WelcomePage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome!</Text>
      <Text style={styles.welcome_paragraph}>
        This is your new <Text style={styles.outstand}>companion</Text> on your
        journey to <Text style={styles.outstand}>get organized</Text>, and
        <Text style={styles.outstand}> stay organized</Text>!
      </Text>

      <Image style={{ width: 100, height: 100 }} source={staticImage} />

      <View style={styles.btn_area}>
        <Text style={styles.btn_title}>New To The App?</Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.button_text}>Register</Text>
        </Pressable>

        <Text style={styles.btn_title}>Already Have An Account?</Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.button_text}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    width: "100%",
    justifyContent: "space-evenly",
  },

  heading: {
    fontFamily: "Helvetica",
    fontSize: 55,
    color: "#229def",
    textAlign: "center",
    padding: 5,
  },

  btn_area: {
    padding: 3,
    margin: "3%",
    width: "90%",
    height: "20%",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  btn_title: {
    color: "#229def",
    fontSize: 20,
  },

  button: {
    backgroundColor: "#229def",
    width: "100%",
    height: "25%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: 1,
    margin: "5%",
  },

  button_text: {
    paddingLeft: "3%",
    color: "#FFF8DC",
    fontFamily: "Arial",
    fontSize: 20,
  },

  welcome_paragraph: {
    padding: 4,
    fontSize: 30,
  },

  outstand: {
    fontWeight: "bold",
    fontSize: 35,
    color: "#229def",
  },
});
