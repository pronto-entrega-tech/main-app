import device from './device';

const myColors = {
  colorAccent: '#21ADF8',
  primaryColor: '#2196F3',
  primaryColorDark: '#1E80F0',
  background: '#FEFEFE',
  rating: '#FDCC0D',
  divider: '#F4F4F4',
  divider2: '#F0F0F0',
  divider3: '#E2E2E2',
  grey_1: '#C8C8C8',
  grey: '#AAA',
  grey2: '#888',
  grey3: '#575757',
  grey4: '#454545',
  text_1: '#707070',
  text: '#666',
  text2: '#5F5F5F',
  text3: '#505050',
  text4: '#444',
  text4_5: '#404040',
  text5: '#363636',
  text6: '#2F2F2F',
  loading: /* device.iOS ? '#999' : */ '#21ADF8',
} as const;

export default myColors;
