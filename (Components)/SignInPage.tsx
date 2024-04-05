import React, { FC, ReactElement, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";

const SignInPage = () => {
  const [username, setUsername] = useState("");
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
        value={password}
        placeholder={"Password"}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title={"Sign In"} onPress={() => {}} />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 10,
    backgroundColor: "#fff",
  },
});

export default SignInPage;
