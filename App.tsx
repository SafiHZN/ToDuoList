import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox } from "react-native-elements";
import RegisterPage from "./(Components)/RegisterPage";
import SignInPage from "./(Components)/SignInPage";
import ProfilePage from "./(Components)/ProfilePage";
import { WelcomePage } from "./(Components)/WelcomePage";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import "expo-dev-client";
import "react-native-gesture-handler";
import { User } from "firebase/auth";
import ToDoList from "./(Components)/ToDoList";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator();


const RootStack = createStackNavigator<RootStackParamList>();

const navTheme = DefaultTheme;
navTheme.colors.background = "#fafafa";

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator initialRouteName="Welcome">
        <RootStack.Screen name="Welcome" component={WelcomePage} />
        <RootStack.Screen name="Register" component={RegisterPage} />
        <RootStack.Screen name="SignIn" component={SignInPage} />
        <RootStack.Screen name="ToDo" component={ToDoList} initialParams={{id: "TESTUSER"}} />
        <RootStack.Screen name="Profile" component={ProfilePage} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
});
