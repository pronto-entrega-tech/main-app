import React, { ComponentProps } from "react";
/* import { Image, ImageProps } from 'expo-image'; */
import Image from "next/image";
import device from "~/constants/device";
import { thumbHashToDataURL } from "thumbhash";

interface Props extends Omit<ComponentProps<typeof Image>, "src"> {
  source: string;
  thumbhash?: string;
  height: number;
  width: number;
}

const MyImage = ({ source, thumbhash, ...props }: Props) => {
  const placeholder = thumbhash
    ? (thumbHashToDataURL(base64ToBinary(thumbhash)) as `data:image/${string}`)
    : undefined;

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image {...props} placeholder={placeholder} src={source} />
  );
};

const base64ToBinary = (base64: string) =>
  new Uint8Array(
    atob(base64)
      .split("")
      .map((x) => x.charCodeAt(0)),
  );

export default MyImage;
