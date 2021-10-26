import {
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import { myTitle } from '~/constants';

export const myScreenOptions: StackNavigationOptions = {
  title: myTitle,
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
};
