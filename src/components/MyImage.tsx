import React from 'react';
import { Image, ImageProps } from 'expo-image';
import device from '~/constants/device';

const MyImage = (
  props: Omit<ImageProps, 'placeholder'> & { thumbhash?: string },
) => (
  // eslint-disable-next-line jsx-a11y/alt-text
  <Image
    placeholder={{
      thumbhash: device.web // placeholder breaks image on android (expo: ^49, expo-image: ~1.3.2)
        ? props.thumbhash
        : undefined,
    }}
    {...props}
  />
);

export default MyImage;
