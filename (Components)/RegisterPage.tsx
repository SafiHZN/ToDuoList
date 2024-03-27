import React, { FC, ReactElement, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";

const isValidEmail = (email: string): boolean => {
  const emailRegex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", "g");
  return emailRegex.test(email);
};
const isValidPassword = (password: string): boolean => {
  const passwordRegex = new RegExp("^[A-Za-z][A-Za-z0-9]{5,31}");
  return passwordRegex.test(password);
};

const RegisterPage = () => {
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
            // ------------
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});

export default RegisterPage;
