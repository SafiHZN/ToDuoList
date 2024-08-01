import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ToDoList from './(tabs)/ToDoList';
import Schedule  from './(tabs)/Schedule';
import { Props, userListObj, userPublic } from '../types';
import { lazy, useEffect } from 'react';
import ProfilePage from './(tabs)/ProfilePage';
import { collectionGroup, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { DATABASE } from '../firebaseConfig';

const Tab = createBottomTabNavigator();

export default function Tabs({ route, navigation }: Props) {
    
  const { id } = route.params;
  const docRef = doc(DATABASE, "users", id);

  useEffect(() => {
    const updateSharedLists = async () => {
      const friends = (await getDoc(docRef)).get('friends') as userPublic[];
      friends.forEach(async friend => {
        const matches = query(collectionGroup(DATABASE, 'users'), where("user_name", "==", friend.name));
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
      })
    }

    updateSharedLists();
  },[])

  return (
    <Tab.Navigator>
      <Tab.Screen name="ToDoList">{() => <ToDoList {...{route,navigation}}/>}</Tab.Screen>
      <Tab.Screen name="Schedule">{() => <Schedule {...{route, navigation}}/>}</Tab.Screen>
      <Tab.Screen name="Profile">{() => <ProfilePage {...{route, navigation}}/>}</Tab.Screen>
    </Tab.Navigator>
  );
}