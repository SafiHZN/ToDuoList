import React, { FC, ReactElement, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 15,
    width: "90%",
    height: 80,
    fontSize: 35,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#1ea4fc",
  },

  container: {
    alignItems: "center",
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
});

export default SignInPage;
