import React from 'react';
import { View, Share, StatusBar } from 'react-native';
import IconButton from '~/components/IconButton';
import { myColors, device } from '~/constants';
import useRouting from '~/hooks/useRouting';
import { Urls } from '~/constants/urls';

const ProductHeader = () => {
  const routing = useRouting();
  /* const { notify, onPressNot } = useMyContext(); */

  const share = () => {
    const { city, itemId } = routing.params;
    const url = `${Urls.WWW}/produto/${city}/${itemId}`;

    if (!device.web) Share.share({ message: url });
    else navigator.share({ url });
  };

  return (
    <>
      <View
        style={{
          height: device.android
            ? StatusBar.currentHeight
            : device.iPhoneNotch
            ? 34
            : 0,
          backgroundColor: myColors.background,
        }}
      />
      <View
        style={{
          backgroundColor: myColors.background,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 46,
        }}>
        <IconButton
          icon='arrow-left'
          type='back'
          onPress={() => routing.goBack('Home')}
        />
        <View style={{ flexDirection: 'row' }}>
          {/* <IconButton
            icon={notify.has(item.prod_id) ? 'bell' : 'bell-outline'}
            type='back'
            onPress={() => onPressNot(item)}
          /> */}
          <IconButton icon='share-variant' type='prodIcons' onPress={share} />
        </View>
      </View>
    </>
  );
};

export default ProductHeader;
