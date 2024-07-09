import { StyleSheet, Text, View, Modal, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Calendar} from "react-native-calendars"
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Props, item } from '../../types';
import { DATABASE } from '../../firebaseConfig';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const Schedule = ({ route, navigation }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setDate] = useState<Date>(new Date());

  const { id } = route.params;

  // 0 ==> 00:00 - 00:59, 1 ==> 01:00 - 01:59, 2 ==> 02:00 - 02:59, 3 ==> 03:00 - 03:59, 4 ==> 04:00 - 04:59 ...
  const [data, setData] = useState<item[][]>([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]);
  let userList: item[] = [];
  const docRef = doc(DATABASE, "users", id);

  const setDataSelectedDate = () => {
    let nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    for(let i=0; i<24; i++){
      data[i] = userList.filter(item => item.scheduled && item.date.toDate().toDateString() === selectedDate.toDateString());
      setData(...[data]);
      console.log(data[i]);
    }
  }

  useEffect(() => {
    const fetchUserList = async () => {
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.exists()) {
        userList = querySnapshot.get("user_list");
      } else {
        console.log("no such doc");
        console.log(querySnapshot.data());
      }
    };

    fetchUserList().then(() => {
      setDataSelectedDate();
    });
  }, [selectedDate]);

  return (
    <View style={styles.container}>
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
                  marginLeft: 30,}}>
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

export default Schedule

const styles = StyleSheet.create({
  container: {
    justifyContent:"flex-start",
    height: "100%",
    width: "100%",
  },
  
  selectDate: {
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    margin: 25,
    marginRight: 35,
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

