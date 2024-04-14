import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox } from "react-native-elements";
import RegisterPage from "./(Components)/RegisterPage";
import ToDoList from "./(Components)/ToDoList";
import SignInPage from "./(Components)/SignInPage";
import ProfilePage from "./(Components)/ProfilePage";
import { WelcomePage } from "./(Components)/WelcomePage";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import "expo-dev-client";
import "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  SignIn: undefined;
  ToDo: undefined;
  Profile: undefined;
};
const RootStack = createStackNavigator<RootStackParamList>();

const navTheme = DefaultTheme;
navTheme.colors.background = "#fafafa";

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="ToDo" component={ToDoList} />
        <Stack.Screen name="Profile" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
});
