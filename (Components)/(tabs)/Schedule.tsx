import { StyleSheet, Text, View, Modal, Pressable, FlatList } from 'react-native';
import {useCallback, useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Props, item, userListObj } from '../../types';
import { DATABASE } from '../../firebaseConfig';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'

const Schedule = ({ route, navigation }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setDate] = useState<Date>(new Date());

  const { id } = route.params;

  // 0 ==> 00:00 - 00:59, 1 ==> 01:00 - 01:59, 2 ==> 02:00 - 02:59, 3 ==> 03:00 - 03:59, 4 ==> 04:00 - 04:59 ...
  const [data, setData] = useState<item[][]>([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [currentList, setCurrentList] = useState<userListObj>({title: "To-Do", list: [{ checked: false, text: "New Item", date: new Timestamp(Date.now()/1000, 0), scheduled: false}], shared: false});
  const [userLists, setUserLists] =  useState<userListObj[]>([]);
  const docRef = doc(DATABASE, "users", id);

  const setDataSelectedDate = () => {
    for(let i=0; i<24; i++){
      data[i] = currentList.list.filter(item => item.scheduled && item.date.toDate().toDateString() === selectedDate.toDateString() && item.date.toDate().getHours() == i && !item.checked);
      setData([...data]);
      setIsDataUpdated(true);
    }
  }

  useFocusEffect(
    useCallback(() => {
      const fetchUserLists = async () => {
        const querySnapshot = await getDoc(docRef);
        if (querySnapshot.exists()) {
          const tempList = querySnapshot.get("user_lists");
          if(tempList.length > 0){
            setCurrentList(tempList[0]);
          }
          setUserLists([...tempList]);
        } else {
          console.log("no such doc");
          console.log(querySnapshot.data());
        }
      };
  
      fetchUserLists().then(() => {
        setDataSelectedDate();
      })

      return() => {
        setIsDataUpdated(false);
      }
    }, [selectedDate])
  );

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

  if(isDataUpdated){
    return (
      <View style={styles.container}>

        <View style={{width: "100%", flexDirection: "row", marginHorizontal: 10}}>
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
        
        <Pressable style={styles.selectDate} onPress={() => setShowModal(true)}>
            <Text style={styles.selectDateText}>{selectedDate.toLocaleDateString()}</Text>
          </Pressable>
          <Modal visible={showModal} animationType='fade' style={
            {
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }
          }>
            <Text style={styles.dtpicker_info}>Select the date of the schedule to be displayed</Text>
            <RNDateTimePicker style={styles.dtpicker} value={selectedDate} display="default" mode="date" onChange={(e, date) => { if(date !== undefined) setDate(date) }}/>
            <Pressable style={styles.confirm_date} onPress={() => {
              setShowModal(false);
              }}>
              <Text style={styles.confirm_date_text}>Confirm</Text>
            </Pressable>
          </Modal>
      </View>


        <FlatList
        style={{width:"100%", paddingHorizontal: 35}}
        data={data}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({item, index}) => {
          return (
            <View style={
              {
                marginTop: 15,
                minHeight: 75,
                height: "auto",
                borderBottomColor: "black",
                borderBottomWidth: 1,
              }
            }>
              <Text style={{fontWeight: "300", fontFamily: "sans-serif", marginLeft: 15}}>{index}:00 - {index}:59</Text>
              <View>
              <FlatList
            style={styles.items_list}
            data={data[index]}
            ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
            renderItem={({ item }) => (
              <View style={styles.list_item}>
                <Text style={{textDecorationLine: item.checked ? "line-through" : "none",
                    position: "absolute",
                    fontSize: 20,
                    fontFamily: "sans-serif",
                    marginLeft: 15,}}>
                    {item.text}
                  </Text>
              </View>
            )}
          />
              </View>
            </View>
          )}
        }
          />
      </View>
    )
  }
  else{
    return (
      <View style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Text style={{fontSize: 30, fontFamily: "sans-serif", textAlign: "center"}}>LOADING</Text>
      </View>
    )
  }
}

export default Schedule

const styles = StyleSheet.create({
  container: {
    justifyContent:"flex-start",
    height: "100%",
    width: "100%",
  },

  selectList: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 2, 
    marginVertical: 25,
    marginHorizontal: 15,
    bottom: 0,
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

  
  selectDate: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    marginVertical: 25,
    marginHorizontal: 15,
    width: 175,
    height: 40,
    borderColor: "#229def",
    borderRadius: 10,
    borderWidth: 1,
  },

  selectDateText:{
    color: "#229def",
    fontFamily: "sans-serif",
    fontSize: 27,
  },

  calendar:{
    borderRadius: 10,
    marginHorizontal: 50,
    marginVertical: 150
  },

  items_list: {
    alignSelf: "center",
    maxHeight: 475,
    width: "100%",
    flex: 1,
    marginVertical: 10,
  },

  list_item:{
    marginHorizontal: 5,
    paddingHorizontal: 10,
    height: 30,
    width: "95%",
    position: "relative",
    alignSelf: "flex-end",
    alignItems: "flex-start",
    justifyContent: "center",
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
})

