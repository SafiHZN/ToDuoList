import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Timestamp } from "firebase/firestore";

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  SignIn: undefined;
  ToDo: {
    id: string
  };
  Profile: undefined
};

export type Props = NativeStackScreenProps<RootStackParamList, 'ToDo'>;

export type item = {
    checked: boolean;
    text: string;
    date: Timestamp;
    scheduled: boolean,
  };