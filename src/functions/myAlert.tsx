import { device } from "../constants";
import { Alert } from 'react-native';

function myAlert(mensage: string) {
  if (!device.web) {
    Alert.alert(mensage)
  } else {
    alert(mensage)
  }
}

export default myAlert