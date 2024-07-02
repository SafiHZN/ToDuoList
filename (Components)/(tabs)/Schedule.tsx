import { StyleSheet, Text, View, Modal, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import {Calendar} from "react-native-calendars"

const Schedule = () => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("Select Date");

  // 0 ==> 00:00 - 00:59, 1 ==> 01:00 - 01:59, 2 ==> 02:00 - 02:59, 3 ==> 03:00 - 03:59, 4 ==> 04:00 - 04:59 ...
  const data = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

  return (
    <View style={styles.container}>
      <Pressable style={styles.selectDate} onPress={() => setShowModal(true)}>
        <Text style={styles.selectDateText}>{date}</Text>
      </Pressable>
      <Modal visible={showModal} animationType='fade' style={
        {
          justifyContent:"center",
          alignItems: "center"
        }
      }>
        <Calendar style={styles.calendar}
        onDayPress={selectedDate => {
          setDate(selectedDate.dateString)
          setShowModal(false);
        }}
        theme={{
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#229def',
          selectedDayTextColor: '#229def',
          todayTextColor: '#9932CC',
          arrowColor: "#229def"
        }}
        hideExtraDays={true}
        />
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
              borderBottomColor: "black",
              borderBottomWidth: 1,
            }
          }>
            <Text style={{fontWeight: "300", fontFamily: "sans-serif", marginLeft: 15}}>{index}:00 - {index}:59</Text>
            <View>
              {/* display tasks */}
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
})

