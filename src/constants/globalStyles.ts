import { StyleSheet, StatusBar } from 'react-native';
import myColors from './myColors';
import device from './device';

const web = device.web ? 2 : 0;
const globalStyles = StyleSheet.create({
  centralizer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notch: {
    marginTop: device.android
      ? StatusBar.currentHeight
      : device.iPhoneNotch
      ? 34
      : 0,
  },
  darkBorder: {
    borderWidth: device.web ? 1 : 0,
    borderColor: myColors.divider,
  },
  elevation1: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0 + web,
  },
  elevation2: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41 + web,
  },
  elevation3: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22 + web,
  },
  elevation4: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62 + web,
  },
  elevation5: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84 + web,
  },
});

export default globalStyles;