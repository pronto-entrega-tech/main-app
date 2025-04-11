import account from "@public/icons/account.png";
import logo from "@public/logo.webp";
import tomato from "@public/icons/tomato.webp";
import broccoli from "@public/icons/broccoli.webp";
import pineapple from "@public/icons/pineapple.webp";
import google from "@public/icons/google.png";
import apple from "@public/icons/apple.png";
import facebook from "@public/icons/facebook.png";
import GPay from "@public/icons/gPay.png";
import ApplePay from "@public/icons/applePay.png";
import cash from "@public/icons/cash.png";
import pix from "@public/icons/pix.png";
import creditCard from "@public/icons/credit-card.png";
import mastercard from "@public/icons/mastercard.png";
import visa from "@public/icons/visa.png";
import elo from "@public/icons/elo.png";
import device from "./device";

const rawImages = {
  account,
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
type ImagesName = keyof typeof rawImages;

export type ImageSource = {
  source: number;
  defaultSource?: number;
};

const images = Object.entries(rawImages).reduce(
  (images, [name, v]) => ({
    ...images,
    [name]: device.web
      ? { source: v.src, defaultSource: v.blurDataURL }
      : { source: v },
  }),
  {} as {
    [x in ImagesName]: ImageSource;
  },
);

export const paymentImages: Record<string, ImageSource> = {
  Dinheiro: images.cash,
  Pix: images.pix,
  Mastercard: images.mastercard,
  Visa: images.visa,
  Elo: images.elo,
};

export default images;
