import { StyleSheet, Text, View, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import {Calendar} from "react-native-calendars"

const Schedule = () => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("Select Date");

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
    </View>
  )
}

export default Schedule

const styles = StyleSheet.create({
  container: {
    justifyContent:"flex-start",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  
  selectDate: {
    backgroundColor: "#229def",
    width: 175,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    margin: 25,
  },
  selectDateText:{
    color: "white",
    fontFamily: "Arial",
    fontSize: 27,
  },
  calendar:{
    borderRadius: 10,
    marginHorizontal: 50,
    marginVertical: 150
  },
})

