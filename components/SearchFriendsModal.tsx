import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { userPublic } from '../types';
import { doc, getDoc,  collectionGroup, query, where, getDocs } from "firebase/firestore";  
import { DATABASE } from '../firebaseConfig';

interface SearchForFriendsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFriend: (newFriend: userPublic) => void;
}

const SearchForFriendsModal: React.FC<SearchForFriendsModalProps> = ({
  visible,
  onClose,
  onAddFriend,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<userPublic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      setLoading(true);

      const matches = query(collectionGroup(DATABASE, 'users'), where('user_name', '==', searchTerm));
      const querySnapshot = await getDocs(matches);
      if(querySnapshot.docs.length > 0){
        const tempRes = querySnapshot.docs.map(doc => {
          return {
            name: doc.get('user_name'),
            email: doc.get('user_email')
          } as userPublic
        });
        console.log(tempRes);
        setSearchResults(tempRes); 
      } else{
        setSearchResults([]);
        console.log("no results");
      }
      setLoading(false);
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleSearchTermChange = (text: string) => {
    setSearchTerm(text);
  };

  const handleAddFriend = (newFriend: userPublic) => {
    onAddFriend(newFriend);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>Search for Friends</Text>
          <Pressable onPress={onClose}>
            <Icon name="close" size={27} />
          </Pressable>
        </View>
        <View style={styles.modalBody}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for friends"
            value={searchTerm}
            onChangeText={handleSearchTermChange}
          />
          {loading ? (
            <Text>Loading...</Text>
          ) : (searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <View style={styles.searchResultItem}>
                  <Text style={styles.searchResultText}>{item.name}</Text>
                  <Pressable onPress={() => handleAddFriend(item)}>
                    <Icon name="person-add-alt" size={27} />
                  </Pressable>
                </View>
              )}
            />
          ) : 
            <Text>No results found</Text>)
          }
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    minHeight: 100,
    maxHeight: 500,
    width: 300,
    padding: 20,
    backgroundColor: "#fff"
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  searchResultText: {
    fontSize: 16,
  },
});

export default SearchForFriendsModal;