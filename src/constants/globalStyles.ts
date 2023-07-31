import { StyleSheet } from 'react-native';
import { css } from 'styled-components/native';
import myColors from './myColors';
import device, { notchHeight } from './device';

const web = device.web ? 2 : 0;
const globalStyles = StyleSheet.create({
  centralizer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notch: {
    marginTop: notchHeight,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 66,
  },
  bottomButton: {
    backgroundColor: 'white',
    position: device.web ? ('fixed' as any) : 'absolute',
    alignSelf: 'center',
    height: 46,
    minWidth: 210,
    // MyButton overwrite paddingHorizontal
    paddingLeft: 24,
    paddingRight: 24,
    bottom: device.iPhoneNotch ? 38 : 12,
    borderWidth: 2,
  },
  darkBorder: {
    borderWidth: device.web ? 1 : 0,
    borderColor: myColors.divider,
  },
  elevation1: {
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1 + web,
  },
  elevation2: {
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41 + web,
  },
  elevation3: {
    elevation: 3,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22 + web,
  },
  elevation4: {
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62 + web,
  },
  elevation5: {
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84 + web,
  },
});

export const GlobalStyles = {
  centralizer: css`
    flex: 1;
    align-items: center;
    justify-content: center;
  `,
  notch: css`
    margin-top: ${notchHeight};
  `,
  container: css`
    padding: 18px 16px 66px 16px;
  `,
  bottomButton: css`
    background-color: white;
    position: ${device.web ? 'fixed' : 'absolute'};
    align-self: center;
    height: 46px;
    min-width: 210px;
    padding-left: 24px;
    padding-right: 24px;
    bottom: ${device.iPhoneNotch ? 38 : 12}px;
    border-width: 2px;
  `,
  darkBorder: css`
    border-width: ${device.web ? 1 : 0}px;
    border-color: ${myColors.divider};
  `,
  elevation1: css`
    elevation: 1;
    shadow-color: black;
    shadow-offset: 0px 1px;
    shadow-opacity: 0.18;
    shadow-radius: ${1 + web}px;
  `,
  elevation2: css`
    elevation: 2;
    shadow-color: black;
    shadow-offset: 0px 1px;
    shadow-opacity: 0.2;
    shadow-radius: ${1.14 + web}px;
  `,
  elevation3: css`
    elevation: 3;
    shadow-color: black;
    shadow-offset: 0px 1px;
    shadow-opacity: 0.22;
    shadow-radius: ${2.22 + web}px;
  `,
  elevation4: css`
    elevation: 4;
    shadow-color: black;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.23;
    shadow-radius: ${2.62 + web}px;
  `,
  elevation5: css`
    elevation: 5;
    shadow-color: black;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: ${3.84 + web}px;
  `,
};

export default globalStyles;
