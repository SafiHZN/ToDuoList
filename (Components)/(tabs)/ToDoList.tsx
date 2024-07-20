import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, {
  ChangeEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { APP } from "../../firebaseConfig";
import { getFirestore } from "firebase/firestore";
import {
} from "@react-navigation/native-stack";
import { Props, RootStackParamList, item, userListObj } from "../../types";import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from "@react-native-community/datetimepicker";

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

const ToDoList = ({ route, navigation }: Props) => {
  const defaultItem: item = { checked: false, text: "New Item", date: new Timestamp(Date.now()/1000, 0), scheduled: false};

  const { id } = route.params;

  let userLists : userListObj[] = [];
  let currentListIndex = 0;
  const [items, changeItems] = useState<item[]>([]);
  const hasPageRendered = useRef(false);
  const docRef = doc(DATABASE, "users", id);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setDate] = useState<Date>(new Date());

  const [indexOfSelectedItem, setIndexOfSelectedItem] = useState(-1);

  //list manager
  useEffect(() => {
    // Update list when items[] changes
    if (hasPageRendered.current) {
      const updateUserLists = async (itemsList: item[]) => {
        if(userLists.length > currentListIndex){
          userLists[currentListIndex].list = itemsList;
        } else{
          userLists.push({title: "To-Do", shared: false, list: itemsList});
        }
        await updateDoc(docRef, {
          user_lists: [...userLists],
        });
      };
      updateUserLists([...items]);
    } else {
      // Fetch the list initially
      hasPageRendered.current = true;

      const fetchUserLists = async () => {
        const querySnapshot = await getDoc(docRef);
        if (querySnapshot.exists()) {
          userLists = querySnapshot.get("user_lists");
          if(userLists.length > 0){
            if(!userLists[0].shared){
              changeItems(userLists[0].list);
            }else{
              // handle list is shared(title == an id) and switch to that account(maybe change docref?)
            }
          }
        } else {
          console.log("no such doc");
          console.log(querySnapshot.data());
        }
      };

      fetchUserLists();
    }
  }, [items]);

  const addItem = (e: GestureResponderEvent): void => {
    changeItems((items) => [...items, defaultItem]);
  };

  function toggleCheck(index: number): void {
    items[index].checked = items[index].checked ? false : true;
    changeItems([...items]);
  }

  const removeItem = (index: number): void => {
    let res = items.filter((item, i) => i != index);
    changeItems(res);
  };

  const itemTextChange = (index: number, newText: string): void => {
    items[index].text = newText;
    changeItems([...items]);
    // if(newText == "" && (cursor off) ){
    //   removeItem(index);
    // }
  };

  const selectList = (listName: string) => {
    // do some stuff
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.selectList} onPress={() => {
        // dropdown menu and select a list
      }}>
        <Text style={styles.selectListText}>Select List</Text>
      </Pressable>
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
                  width: 200,
                  textDecorationLine: item.checked ? "line-through" : "none",
                  position: "absolute",
                  fontSize: 30,
                  fontFamily: "sans-serif",
                  marginLeft: "15%",
                }}
              />
              <Pressable
                style={styles.add_date_btn}
                onPress={(e) => {
                  setIndexOfSelectedItem(items.indexOf(item));
                  setShowModal(true);
                }}
              >
                <Icon name="calendar" size={27} />
              </Pressable>
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
        <Modal visible={showModal} animationType='fade' style={
        {
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }
      }>
        <Text style={styles.dtpicker_info}>Pick the date & time you would like to set this task to</Text>
        <RNDateTimePicker style={styles.dtpicker} value={selectedDate} display="default" mode="datetime" onChange={(e, date) => { if(date !== undefined) setDate(date) }}/>
        <Pressable style={styles.confirm_date} onPress={() => {
          items[indexOfSelectedItem].date = new Timestamp(selectedDate.getTime()/1000, 0);
          items[indexOfSelectedItem].scheduled = true;
          changeItems([...items]);
          setShowModal(false);
          }}>
          <Text style={styles.confirm_date_text}>Confirm</Text>
        </Pressable>
      </Modal>
        <Pressable style={styles.addItemButton} onPress={addItem}>
          <Text style={styles.addItemButtonText}>Add Item</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
    width: "100%",
  },

  selectList: {
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    marginVertical: 40,
    marginRight: 35,
    width: 175,
    height: 40,
    borderColor: "#229def",
    borderRadius: 10,
    borderWidth: 1,
  },

  selectListText: {
    color: "#229def",
    fontFamily: "sans-serif",
    fontSize: 27,
  },

  // (to do list section)
  tdlSection: {
    height: "80%",
    width: "80%",
  },

  addItemButton: {
    backgroundColor: "#229def",
    width: 235,
    height: 65,
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    margin: 45,
  },

  addItemButtonText: {
    color: "white",
    fontFamily: "sans-serif",
    fontSize: 45,
  },

  delete_btn: {
    position: "absolute",
    alignSelf: "flex-end",
    margin: 3,
  },
  add_date_btn: {
    position: "absolute",
    alignSelf: "flex-end",
    paddingRight: 50
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
    maxHeight: 475,
    width: "100%",
    flex: 1,
  },

  calendar:{
    borderRadius: 10,
    marginHorizontal: 50,
    marginVertical: 150
  },

  dtpicker: {
    alignSelf: "center",
    margin: 50
  },

  dtpicker_info:
  {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 25,
    marginTop: 200,
    padding: 25,
    fontFamily: "sans-serif",
    fontSize: 25,
  },

  confirm_date:{
    backgroundColor: "#229def",
    width: 165,
    height: 45,
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    margin: 45,
  },

  confirm_date_text:{
    color: "white",
    fontFamily: "sans-serif",
    fontSize: 30,
  }
});

export default ToDoList;
