import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Props, userPublic } from "../../types";
import { doc, getDoc } from "firebase/firestore";
import { DATABASE } from "../../firebaseConfig";
import { FlatList } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import SearchForFriendsModal from "../../components/SearchFriendsModal";

const ProfilePage = ({ route, navigation }: Props) => {
  
  const { id } = route.params;
  const docRef = doc(DATABASE, "users", id);
  

  const [user, setUser] = useState({
    name: "USERNAME IS LOADING...",
    email: "EMAIL IS LOADING...",
    friends: [] as userPublic[]
  });

  const [showSearchFriendsModal, setShowSearchFriendsModal] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDoc(docRef);
      if (querySnapshot.exists()) {
        let tempUserName = querySnapshot.get('user_name');
        let tempUserEmail = querySnapshot.get('user_email');
        let tempUserFriends = querySnapshot.get('friends');

        setUser({ name: tempUserName, email: tempUserEmail, friends: tempUserFriends});
      }
      setIsDataFetched(true);
    }

    fetchData()
  }, []);

  const handleAddFriend = (newFriend: userPublic) => {
    // const updatedFriends = [...user.friends, newFriend];
  }


  if(isDataFetched){
    return (
      <View>
        <Text style={styles.header}>
          {/* BIG BLACK HEADER - USERNAME */}
          {user.name}
        </Text>
        <View style={styles.infoSection}>
          {/* INFO */}
          <Text style={styles.infoText}>
            Email: {user.email}
          </Text>

          <Text style={styles.infoText}>Friends: </Text>
          <FlatList 
            data={user.friends}
            renderItem={({ item }) => (
              <View style={styles.friendItem}>
                <Icon name="dot" size={27} />
                <Text style={styles.infoText}>{item.name}</Text>
              </View>
            )}
            />
            <Pressable
              style={{ margin: 25 }}
              onPress={() => {
                setShowSearchFriendsModal(true);
              }}
            >
              <Icon name="person-add-alt" size={27}/>
            </Pressable>

        </View>

        <SearchForFriendsModal
        visible={showSearchFriendsModal}
        onClose={() => setShowSearchFriendsModal(false)}
        onAddFriend={handleAddFriend}
        />
      </View>
    );
  } else{
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
};
export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    // container
    width: "100%",
    height: "100%",
    padding: 5,
  },

  header: {
    // header
    alignSelf: "center",
    padding: 40,
    fontSize: 40,
    color: "#229def"
  },

  infoSection: {
    margin: 10,
    justifyContent: "center"
  },

  infoText: {
    fontSize: 17,
    margin: 5
  },

  friendItem: {
    // friend item
    marginHorizontal: 25,
    marginVertical: 10,
  },
});
