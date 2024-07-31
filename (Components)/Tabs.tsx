import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ToDoList from './(tabs)/ToDoList';
import Schedule  from './(tabs)/Schedule';
import { Props } from '../types';
import { lazy } from 'react';
import ProfilePage from './(tabs)/ProfilePage';

const Tab = createBottomTabNavigator();

export default function Tabs({ route, navigation }: Props) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ToDoList">{() => <ToDoList {...{route,navigation}}/>}</Tab.Screen>
      <Tab.Screen name="Schedule">{() => <Schedule {...{route, navigation}}/>}</Tab.Screen>
      <Tab.Screen name="Profile">{() => <ProfilePage {...{route, navigation}}/>}</Tab.Screen>
    </Tab.Navigator>
  );
}