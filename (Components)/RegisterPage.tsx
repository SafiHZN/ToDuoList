import React, { FC, ReactElement, useState } from "react";
import { Button, Pressable, StyleSheet, TextInput, View, Image } from "react-native";
import { RootStackParamList } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { APP } from "../firebaseConfig";
import { Text } from "react-native-elements";
import { error } from "console";
import { text } from "stream/consumers";
import { Firestore, addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";

type item = {
  checked: boolean;
  text: string;
};

const AUTH = getAuth(APP);
const DATABASE = getFirestore(APP);

const RegisterPage = () => {
  
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);


  const isValidEmail = (email: string): boolean => {
    const emailRegex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", "g");
    const res =  emailRegex.test(email);

    if(!res){
      showError("Invalid Email")
    }

    return res;
  };
  const isValidPassword = (password: string): boolean => {
    const passwordRegex = new RegExp("^[A-Za-z][A-Za-z0-9]{5,31}");
    const res = passwordRegex.test(password);
  
    if(!res){
      showError("Invalid password")
    }

    return res;
  };

  const showError = (errorMessage: string): void => {
    setError( "* " + errorMessage + "!");
    setIsError(true);
  }

  const staticImage = require("../assets/logo.png");

  return (
    <View style={styles.container}>
    <View style={styles.heading}>
      <Image style={styles.img} source={staticImage} />
      <Text style={styles.header}>Register !</Text>
    </View>
      
      <Text style={(isError ? styles.error_show : styles.error_hide)}>
        {error}
      </Text>

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
      {/* <TextInput
        style={styles.input}
        value={phoneNumber}
        placeholder={"Phone Number"}
        onChangeText={(text) => setPhoneNumber(text)}
        autoCapitalize={"none"}
      /> */}
      <TextInput
        style={styles.input}
        value={password}
        placeholder={"Password"}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      
      <Text style={styles.password_criteria}>
        * Password must start with a letter and contain 6 - 32 characters
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          if (isValidEmail(email) && isValidPassword(password)) {
            createUserWithEmailAndPassword(AUTH, email, password)
              .then(async (userCredential) => {
                // Signed up
                const user = userCredential.user;
                const id = user.uid;
                try {
                  await setDoc(doc(DATABASE, "users", id), {
                      user_email: email,
                      user_name: username,
                      user_list: [{ checked: false, text: "New Item" }]
                    });
                } catch (e) {
                  console.error("Error adding document: ", e);
                }

                //go to ToDoList
                navigation.navigate("ToDo", {id});
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                showError(errorMessage);
              });
          }
        }}
      >
        <Text style={styles.button_text}>Create Account</Text>
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
    width: 200,
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

  password_criteria: {
    fontFamily: "Arial",
    color: "#ffc03f",
    fontSize: 15,
    margin: 5,
  }
});

export default RegisterPage;
