import React from 'react';
import { Image, ImageProps } from 'expo-image';

interface Props extends Omit<ImageProps, 'source'> {
  source: string;
  thumbhash?: string;
  height: number;
  width: number;
}

const MyImage = ({
  source,
  thumbhash,
  style,
  height,
  width,
  ...props
}: Props) => {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      placeholder={{ thumbhash }}
      source={`${source}?cacheBreak=${thumbhash}`}
      style={[{ height, width }, style]}
      {...props}
    />
  );
};

export default MyImage;
