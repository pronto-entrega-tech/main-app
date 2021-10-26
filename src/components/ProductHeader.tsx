import React from 'react';
import { View, Share, StatusBar } from 'react-native';
import IconButton from '~/components/IconButton';
import { myColors, device } from '~/constants';
import useMyContext from '~/core/MyContext';
import useRouting from '~/hooks/useRouting';
import { WWW } from '~/constants/url';

export default function ProductHeader(props: { pathname?: string }) {
  const routing = useRouting();
  const pathname = props.pathname || routing.pathname; // `||` to filter empty string
  const { notify, onPressNot } = useMyContext();

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
          onPress={() => routing.goBack('/inicio')}
        />
        <View style={{ flexDirection: 'row' }}>
          {/* <IconButton
            icon={notify.has(item.prod_id) ? 'bell' : 'bell-outline'}
            type='back'
            onPress={() => onPressNot(item)}
          /> */}
          <IconButton
            icon='share-variant'
            type='prodIcons'
            onPress={() => {
              if (!device.web) {
                Share.share({
                  message: WWW + pathname,
                });
              } else {
                navigator.share({
                  url: WWW + pathname,
                });
              }
            }}
          />
        </View>
      </View>
    </>
  );
}
