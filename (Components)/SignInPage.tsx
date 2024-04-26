import React, { FC, ReactElement, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Image,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { APP } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { getFirestore } from "firebase/firestore";
import { Text } from "react-native-elements";

const AUTH = getAuth(APP);
const DATABASE = getFirestore(APP);

const SignInPage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const showError = (errorMessage: string): void => {
    setError("* " + errorMessage + "!");
    setIsError(true);
  };

  const staticImage = require("../assets/logo.png");

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Image style={styles.img} source={staticImage} />
        <Text style={styles.header}>Sign In !</Text>
      </View>

      <Text style={isError ? styles.error_show : styles.error_hide}>
        {error}
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        placeholder={"Email"}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder={"Password"}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <Pressable
        style={styles.button}
        onPress={() => {
          signInWithEmailAndPassword(AUTH, email, password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              const id = user.uid;

              //go to ToDoList
              navigation.navigate("ToDo", { id }); // link user with and collection       ********
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              showError(errorMessage);
            });
        }}
      >
        <Text style={styles.button_text}>Sign In</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
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
  input: {
    width: "100%",
    margin: "3%",
    marginBottom: "0%",
    padding: "3%",
    height: 50,
    backgroundColor: "#fff",
  },
  button: {
    margin: "5%",
    marginTop: "15%",
    backgroundColor: "#5bbcfc",
    width: 170,
    height: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  button_text: {
    color: "#fdfdfd",
    fontFamily: "Arial",
    fontSize: 23,
  },

  error_show: {
    fontFamily: "Arial",
    color: "red",
    fontSize: 20,
    margin: 5,
  },

  error_hide: {
    color: "rgba(0,0,0,0)",
    margin: 5,
  },
});

export default SignInPage;
