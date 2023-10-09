import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ToDoList from "./(Components)/ToDoList";
import { CheckBox } from "react-native-elements";

export default function App() {
  return (
    <View style={styles.container}>
      <ToDoList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
});
