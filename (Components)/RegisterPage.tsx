import React, { FC, ReactElement, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { RootStackParamList } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { APP } from "../firebaseConfig";

const auth = getAuth(APP);

const isValidEmail = (email: string): boolean => {
  const emailRegex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", "g");
  return emailRegex.test(email);
};
const isValidPassword = (password: string): boolean => {
  const passwordRegex = new RegExp("^[A-Za-z][A-Za-z0-9]{5,31}");
  return passwordRegex.test(password);
};

const RegisterPage = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <TextInput
        style={styles.input}
        value={username}
        placeholder={"Username"}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        value={email}
        placeholder={"Email"}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        value={phoneNumber}
        placeholder={"Phone Number"}
        onChangeText={(text) => setPhoneNumber(text)}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder={"Password"}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        title={"Create Account"}
        onPress={() => {
          if (isValidEmail(email) && isValidPassword(password)) {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                // ...
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
              });
            // save account with empty to-do list
            navigation.navigate("ToDo");
          } else {
            navigation.navigate("Welcome");
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#5bbcfc",
    width: "50%",
    height: "25%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  button_text: {
    paddingLeft: "3%",
    color: "#FFF8DC",
    fontFamily: "Arial",
    fontSize: 20,
  },
});

export default RegisterPage;
