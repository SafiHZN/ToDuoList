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
import { RootStackParamList } from "../types";

const staticImage = require("../assets/logo.png");
export const WelcomePage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
      <Image style={styles.img} source={staticImage} />
      <Text style={styles.header}>Welcome !</Text>
    </View>

      <Text style={styles.welcome_paragraph}>
        This is your new <Text style={styles.outstand}>companion</Text> on your
        journey to <Text style={styles.outstand}>get organized</Text>, and
        <Text style={styles.outstand}> stay organized!</Text>
      </Text>

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
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.button_text}>Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    height: "100%",
    width: "100%",
    justifyContent: "flex-start",
    padding: 2,
  },

  heading: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 5,
  },
  img: {
    width: 100,
    height: 100,
    marginTop: 15,
    marginBottom: 5,
  },
  header: {
    fontFamily: "Helvetica",
    fontSize: 45,
    color: "#5bbcfc",
    textAlign: "center",
    padding: 5,
    marginBottom: 30,
    height: 75,
  },

  btn_area: {
    padding: 3,
    margin: "5%",
    width: "90%",
    height: "20%",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  btn_title: {
    color: "#5bbcfc",
    fontSize: 20,
  },

  button: {
    backgroundColor: "#5bbcfc",
    width: "75%",
    height: "30%",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  button_text: {
    paddingLeft: "3%",
    color: "#fdfdfd",
    fontFamily: "Arial",
    fontSize: 20,
  },

  welcome_paragraph: {
    padding: 4,
    fontSize: 30,
    marginBottom: 30,
  },

  outstand: {
    fontWeight: "bold",
    fontSize: 35,
    color: "#5bbcfc",
  },
});
