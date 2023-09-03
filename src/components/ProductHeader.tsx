import React from 'react';
import { View, Share, StatusBar } from 'react-native';
import IconButton from '~/components/IconButton';
import { myColors, device } from '~/constants';
import useRouting from '~/hooks/useRouting';
import { Urls } from '~/constants/urls';
import { GoBackButton } from './MyHeader';

const ProductHeader = () => {
  const { params, goBack } = useRouting();
  /* const { notify, onPressNot } = useMyContext(); */

  const share = () => {
    const { city, itemId } = params;
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
          zIndex: 2,
        }}>
        <GoBackButton onGoBack={() => goBack('Home')} />
        <View style={{ flexDirection: 'row' }}>
          {/* <IconButton
            onPress={() => onPressNot(item)}
            icon={notify.has(item.prod_id) ? 'bell' : 'bell-outline'}
            style={{
              width: 56,
              height: 56,
            }}
          /> */}
          <IconButton
            onPress={share}
            icon='share-variant'
            style={{
              marginLeft: -8,
              width: 56,
              height: 56,
            }}
          />
        </View>
      </View>
    </>
  );
};

export default ProductHeader;
