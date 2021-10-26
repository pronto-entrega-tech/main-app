import loadProdImage from '@public/icons/loadProdImage.png';
import account from '@public/icons/account.png';
import splash from '@public/splash.png';
import logo from '@public/logo.webp';
import tomato from '@public/icons/tomato.webp';
import broccoli from '@public/icons/broccoli.webp';
import pineapple from '@public/icons/pineapple.webp';
import google from '@public/icons/google.png';
import apple from '@public/icons/apple.png';
import facebook from '@public/icons/facebook.png';
import GPay from '@public/icons/gPay.png';
import ApplePay from '@public/icons/applePay.png';
import cash from '@public/icons/cash.png';
import pix from '@public/icons/pix.png';
import creditCard from '@public/icons/credit-card.png';
import mastercard from '@public/icons/mastercard.png';
import visa from '@public/icons/visa.png';
import elo from '@public/icons/elo.png';
import device from './device';

const imgs = {
  /* loadProdImage, */
  account,
  splash,
  logo,
  tomato,
  broccoli,
  pineapple,
  google,
  apple,
  facebook,
  GPay,
  ApplePay,
  pix,
  cash,
  creditCard,
  mastercard,
  visa,
  elo,
};
type imgsKey = keyof typeof imgs;

function images() {
  const kv = Object.entries(imgs);

  let res = {} as {
    [o in imgsKey]: { source: any; defaultSource?: any };
  };

  for (const i of kv) {
    const [k, v] = i;
    res = {
      ...res,
      [k]: device.web
        ? { source: v.src, defaultSource: v.blurDataURL }
        : { source: v },
    };
  }

  return res;
}

export default images();
