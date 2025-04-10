import {
  StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";
import { myTitle } from "~/constants/appInfo";

export const myScreenOptions: StackNavigationOptions = {
  title: myTitle,
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
};
