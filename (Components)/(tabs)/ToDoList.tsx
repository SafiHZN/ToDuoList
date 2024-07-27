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
import { SelectList } from 'react-native-dropdown-select-list'


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

  const [userLists, setUserLists] = useState<userListObj[]>([]);
  const [currentList, setCurrentList] = useState<userListObj>({title: "To-Do", list: [defaultItem], shared: false});
  const isDataFetched = useRef(false);
  const docRef = doc(DATABASE, "users", id);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setDate] = useState<Date>(new Date());

  const [indexOfSelectedItem, setIndexOfSelectedItem] = useState(-1);

  //list manager
  useEffect(() => {
    // Update list
    if (isDataFetched.current) {
      const currListIndex = userLists.findIndex(value => value.title == currentList.title);
      if(userLists.length > currListIndex){
        userLists[currListIndex].list = currentList.list;
        setUserLists([...userLists]);
      } else{
        // index bug
        console.log("index bug!");
      }
    } else {
      // Fetch the list initially
        const fetchUserLists = async () => {
          isDataFetched.current = true;
          try {
            const querySnapshot = await getDoc(docRef);
            if (querySnapshot.exists()) {
              const tempList = querySnapshot.get('user_lists');
              if(tempList.length > 0){
                setUserLists(() => [...tempList]);
              } else{
                setUserLists(() => [{title: "To-Do", list: [defaultItem], shared: false}]);
              }
            } else {
              console.log("No such document");
            }
          } catch (error) {
            console.error("Error fetching user lists:", error);
          }
        };
      
        fetchUserLists();
    }
  }, [currentList]);

  useEffect(() => {
    if(isDataFetched.current && userLists.length > 0){
      updateUserLists();
    }
  }, [userLists]);

  const updateUserLists = async () => {
    await updateDoc(docRef, {
      user_lists: userLists,
    });
  }

  const addItem = (e: GestureResponderEvent): void => {
    setCurrentList(currlist => {
      const newList = [...currlist.list, defaultItem];
      return { ...currlist, list: newList };
    })
  };

  function toggleCheck(index: number): void {
    currentList.list[index].checked = !currentList.list[index].checked;
    setCurrentList(currentList);
  }

  const removeItem = (index: number): void => {
    setCurrentList(currlist => {
      return {...currlist, list: currentList.list.filter((item, i) => i != index)}
    });
  };

  const itemTextChange = (index: number, newText: string): void => {
    currentList.list[index].text = newText;
    setCurrentList({...currentList});
    // if(newText == "" && (cursor off) ){
    //   removeItem(index);
    // }
  };

  const selectList = (listName: string) => {
    const tempList = userLists.find(list => list.title == listName);
    if (tempList) {
      if(!tempList.shared){
        setCurrentList({...tempList});
      } else{
        // handle list is shared -> get list from firebase with the id in shared (shared: false | {id})
      }
    }
  }

  
  // create new list section
  const [showTextInputModal, setShowTextInputModal] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleAddList = () => {
    setShowTextInputModal(true);
  };
  
  const handleDeleteList = () => {
    const currListIndex = userLists.findIndex(value => value.title == currentList.title);
    if(userLists.length > 1 ){
      userLists.splice(currListIndex, 1);
      setUserLists([...userLists]);
      setCurrentList(userLists[0]);
    } else{
      alert("You must have at least one list");
    }
  };

  const handleTextInputChange = (text: string) => {
    setInputText(text);
  };

  const handleAddListConfirm = async () => {
    if (inputText !== '') {
      setUserLists([...userLists, {title: inputText, list: [{ checked: false, text: "New Item", date: new Timestamp(Date.now()/1000, 0), scheduled: false }], shared: false}])
      setShowTextInputModal(false);
    } else{
      alert('Please enter a name for your list');
    }
  };

  return (
    <View style={styles.container}>
    
      {/* LIST SELECTION SECTION */}
      <View style={{
        flexDirection: 'row',
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Pressable
          onPress={handleAddList}
          style={{
            margin: 10,
            marginTop: 31.5
          }}
        >
          <Icon
            name="plus"
            size={27}
            color="#229def"
          />
        </Pressable>
        <SelectList 
          setSelected={selectList} 
          data={userLists.map(list => list.title)} 
          save="value"
          placeholder="Select List"
          search={false}
          boxStyles={styles.selectList}
          inputStyles={styles.selectListText}
          dropdownStyles={{
            borderColor: "#229def",
            width: 250,
            padding: 10,
            marginBottom: 40,
          }}
          dropdownItemStyles={{
            borderBottomWidth: 1,
            borderBottomColor: "#a0a0a0",
          }}
          dropdownTextStyles={{
            color: "#229def",
            fontFamily: "sans-serif",
            fontSize: 27
          }}
        />
        <Pressable
          onPress={handleDeleteList}
          style={{
            margin: 10,
            marginTop: 31.5
          }}
        >
          <Icon
            name="minus"
            size={27}
            color="#ef2233"
          />
        </Pressable>
      </View>
        
      {/* LIST SECTION */}
      <View style={styles.tdlSection}>
        <FlatList
          style={styles.items_list}
          data={currentList.list}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <View style={styles.list_item}>
              <Pressable
                onPress={(e) => {
                  toggleCheck(currentList.list.indexOf(item));
                }}
              >
                <Icon
                  name={item.checked ? "check-square-o" : "square-o"}
                  size={27}
                />
              </Pressable>
              <TextInput
                onChangeText={(newText) =>
                  itemTextChange(currentList.list.indexOf(item), newText)
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
                  setIndexOfSelectedItem(currentList.list.findIndex(value => value == item));
                  setShowModal(true);
                }}
              >
                <Icon name="calendar" size={27} />
              </Pressable>
              <Pressable
                style={styles.delete_btn}
                onPress={(e) => {
                  removeItem(currentList.list.indexOf(item));
                }}
              >
                <Icon name="trash" size={27} />
              </Pressable>
            </View>
          )}
        />

        {/* CALENDAR MODAL SECTION */}
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
          currentList.list[indexOfSelectedItem].date = new Timestamp(selectedDate.getTime()/1000, 0);
          currentList.list[indexOfSelectedItem].scheduled = true;
          setCurrentList({...currentList});
          setShowModal(false);
          }}>
          <Text style={styles.confirm_date_text}>Confirm</Text>
        </Pressable>
      </Modal>
        
      {/* ADD ITEM SECTION */}
        <Pressable style={styles.addItemButton} onPress={addItem}>
          <Text style={styles.addItemButtonText}>Add Item</Text>
        </Pressable>
      </View>
        
      {/* NEW LIST MODAL SECTION */}
      <Modal visible={showTextInputModal} animationType='fade'>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter the name of this new list:</Text>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={handleTextInputChange}
            placeholder="List name"
          />
          <Pressable style={styles.confirmButton} onPress={handleAddListConfirm}>
            <Text style={styles.confirmButtonText}>Add</Text>
          </Pressable>
        </View>
      </Modal>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 2, 
    bottom: 0,
    marginTop: 40,
    marginBottom: 20,
    width: 175,
    height: 40,
    borderColor: "#229def",
    borderRadius: 10,
    borderWidth: 1,
  },

  selectListText: {
    color: "#229def",
    fontFamily: "sans-serif",
    fontSize: 25,
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
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalTitle: {
    fontSize: 24,
    marginBottom: 10,
  },

  textInput: {
    height: 40,
    borderColor: '#229def',
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 18,
  },

  confirmButton: {
    backgroundColor: '#229def',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  confirmButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ToDoList;
