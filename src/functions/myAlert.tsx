import { device } from '../constants';
import { Alert } from 'react-native';

function myAlert(title: string, mensage?: string) {
  if (!device.web) {
    Alert.alert(title, mensage);
  } else {
    alert(title);
  }
}

export default myAlert;
