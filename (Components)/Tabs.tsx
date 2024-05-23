import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ToDoList from './(tabs)/ToDoList';
import Schedule  from './(tabs)/Schedule';
import { Props } from '../types';

const Tab = createBottomTabNavigator();

export default function Tabs({ route, navigation }: Props) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ToDoList">{() => <ToDoList {...{route,navigation}}/>}</Tab.Screen>
      <Tab.Screen name="Schedule" component={Schedule} />
    </Tab.Navigator>
  );
}