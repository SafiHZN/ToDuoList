import React, { FC, ReactElement, useState } from "react";
import { Button, Pressable, StyleSheet, TextInput, View } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { APP } from "../firebaseConfig";
import { Text } from "react-native-elements";

const auth = getAuth(APP);
const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
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
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
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
  input: {
    width: "100%",
    margin: "3%",
    marginBottom: "0%",
    padding: "3%",
    height: 40,
    backgroundColor: "#fff",
  },
  button: {
    margin: "5%",
    backgroundColor: "#5bbcfc",
    width: "40%",
    height: "5%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  button_text: {
    paddingLeft: "3%",
    color: "#fdfdfd",
    fontFamily: "Arial",
    fontSize: 20,
  },
});

export default SignInPage;
