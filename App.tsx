import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ToDoList from "./(Components)/ToDoList";
import { CheckBox } from "react-native-elements";
import RegisterPage from "./(Components)/RegisterPage";
import { WelcomePage } from "./(Components)/WelcomePage";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import SignInPage from "./(Components)/SignInPage";
import ProfilePage from "./(Components)/ProfilePage";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  SignIn: undefined;
};
const RootStack = createStackNavigator<RootStackParamList>();

const navTheme = DefaultTheme;
navTheme.colors.background = "#fafafa";

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="SignIn" component={SignInPage} />
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
