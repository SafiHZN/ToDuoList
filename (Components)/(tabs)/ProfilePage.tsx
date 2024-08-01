import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Props, userListObj, userPublic } from "../../types";
import { collectionGroup, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
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
    if(isDataFetched){
      const updateData = async () => {
        await setDoc(docRef, {friends: user.friends}, { merge: true});
      }

      updateData();
    } else{
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
    }
  }, [user]);

  const handleAddFriend = async (newFriend: userPublic) => {
    const updatedFriends = [...user.friends, newFriend];
    setUser({ ...user, friends: updatedFriends });
      const matches = query(collectionGroup(DATABASE, 'users'), where("user_name", "!=", user.name));
      const querySnapshot = await getDocs(matches);
      let tempRes: userPublic[];
      if(querySnapshot.docs.length > 0){
        tempRes = querySnapshot.docs.map(doc => {
          const lists = doc.get('user_lists') as userListObj[]; // all lists
          return {
            name: doc.get('user_name'),
            email: doc.get('user_email'),
            sharedLists: lists.filter(list => list.shared != false)
          } as userPublic
        });

        await setDoc(docRef, {friends: tempRes}, { merge: true});
      } else{
        console.log("no docs!");
      }
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
                <Icon name="circle" size={20} />
                <Text style={styles.friendText}>{item.name}</Text>
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
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 25,
    marginVertical: 10,
  },

  friendText: {
    fontSize: 20,
    margin: 5
  }
});
