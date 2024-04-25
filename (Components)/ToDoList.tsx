import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  FlatList,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { ChangeEvent, useReducer, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { APP} from "../firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Props, RootStackParamList, item } from "../types";


const AUTH = getAuth(APP);
const DATABASE = getFirestore(APP);
  

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

const ToDoList = ({route, navigation}: Props) => {
  // const navigation =
  //   useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const defaultItem: item = { checked: false, text: "New Item" };

  const {id} = route.params;
  
  let initialList: item[] = [{ checked: false, text: "Item" }];
  const docRef = doc(DATABASE, "users", id);
  const getInitial = async () => {
    const querySnapshot = await getDoc(docRef);
    if(querySnapshot.exists()){
      initialList = querySnapshot.get("user_list");
      console.log(querySnapshot.get("user_name"));
    } else{
      console.log("no such doc");
      console.log(querySnapshot.data);
    }
  }
  getInitial();
  console.log(initialList);
  console.log(id);

  const [items, changeItems] = useState<item[]>(initialList);

  const updateUserList = async (list: item[]) => {
    await updateDoc(docRef, {
      user_list : [...list]
    });
  }

  const addItem = (e: GestureResponderEvent): void => {
    changeItems((items) => [...items, defaultItem]);
    updateUserList([...items, defaultItem]);
  };

  function toggleCheck(index: number): void {
    items[index].checked = items[index].checked ? false : true;
    changeItems([...items]);
    updateUserList([...items]);
  }

  const removeItem = (index: number): void => {
    let res = items.filter((item, i) => i != index);
    changeItems(res);
    updateUserList(res);
    console.log(res);
  };

  const itemTextChange = (index: number, newText: string): void => {
    items[index].text = newText;
    changeItems([...items]);
    updateUserList([...items]);
    // if(newText == "" && (cursor off) ){
    //   removeItem(index);
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do List</Text>
      <View style={styles.tdlSection}>
        <FlatList
          style={styles.items_list}
          data={items}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <View style={styles.list_item}>
              <Pressable
                onPress={(e) => {
                  toggleCheck(items.indexOf(item));
                }}
              >
                <Icon
                  name={item.checked ? "check-square-o" : "square-o"}
                  size={27}
                />
              </Pressable>
              <TextInput
                onChangeText={(newText) =>
                  itemTextChange(items.indexOf(item), newText)
                }
                value={item.text}
                placeholderTextColor={"black"}
                style={{
                  textDecorationLine: item.checked ? "line-through" : "none",
                  position: "absolute",
                  fontSize: 30,
                  marginLeft: "15%",
                }}
              />
              <Pressable
                style={styles.delete_btn}
                onPress={(e) => {
                  removeItem(items.indexOf(item));
                }}
              >
                <Icon name="trash" size={27} />
              </Pressable>
            </View>
          )}
        />
        <Pressable style={styles.addItemButton} onPress={addItem}>
          <Text style={styles.addItemButtonText}>Add Item</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  delete_btn: {
    position: "absolute",
    alignSelf: "flex-end",
    margin: 3,
  },

  list_item: {
    margin: 5,
    padding: 10,
    height: 44,
    width: "95%",
    position: "relative",
    alignSelf: "flex-end",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  items_list: {
    alignSelf: "center",
    width: "100%",
    flex: 1,
  },

  container: {
    alignItems: "center",
    marginTop: "15%",
    height: "100%",
    width: "100%",
  },

  heading: {
    fontFamily: "Helvetica",
    fontSize: 45,
    color: "#229def",
    textAlign: "center",
    padding: "5%",
  },

  // (to do list section)
  tdlSection: {
    height: "80%",
    width: "80%",
  },

  addItemButton: {
    backgroundColor: "#229def",
    width: "90%",
    height: "10%",
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    margin: "4%",
  },

  addItemButtonText: {
    color: "#FFF8DC",
    fontFamily: "Arial",
    fontSize: 45,
  },
});

export default ToDoList;
