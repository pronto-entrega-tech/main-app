import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import Header from '~/components/Header';
import Loading from '~/components/Loading';
import MyDivider from '~/components/MyDivider';
import MyIcon from '~/components/MyIcon';
import MyText from '~/components/MyText';
import { device, myColors } from '~/constants';

function Devices() {
  /* const [webName, setWebName] = useState('');

  useEffect(() => {
    (async () => {
      const DeviceInfos = navigator.userAgent;
      setWebName(DeviceInfos);
    })();
  }, []);

  if (device.web && !webName) return <Loading />; */

  const currentDevice = (() => {
    switch (Platform.OS) {
      case 'android':
        return {
          icon: 'cellphone-android',
          name: Platform.constants.Model,
          time: '',
        } as const;
      case 'ios':
        return {
          icon: Platform.isPad ? 'tablet-ipad' : 'cellphone-iphone',
          name: Platform.constants.systemName,
          time: '',
        } as const;
      case 'web':
        return {
          icon: 'monitor',
          name: 'Web' /* navigator.userAgent, */,
          time: '',
        } as const;
      default:
        return { icon: 'monitor', name: 'Web', time: '' } as const;
    }
  })();

  return (
    <View style={{ backgroundColor: myColors.background, flex: 1 }}>
      <Header title={'Dispositivos'} />
      <MyText
        style={{
          alignSelf: 'center',
          textAlign: 'center',
          fontSize: 18,
          color: myColors.text2,
          marginTop: 20,
          marginBottom: 20,
        }}>
        {'Dispositivos em que sua conta\nfoi conectada'}
      </MyText>
      {[currentDevice].map((item, i) => (
        <View key={i}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingVertical: 8,
              alignItems: 'center',
            }}>
            <MyIcon name={item.icon} color='#636363' size={32} />
            <View style={{ marginLeft: 16, flexGrow: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <MyText style={{ color: myColors.text4, fontSize: 17 }}>
                  {item.name}
                </MyText>
                <MyText
                  style={{
                    color: i === 0 ? '#44aa44' : '#999',
                    fontSize: 12,
                    marginLeft: 8,
                    marginBottom: 2,
                    fontFamily: 'Medium',
                  }}>
                  {i === 0 ? 'Dispositivo atual' : 'Há ' + item.time}
                </MyText>
              </View>
              <MyText
                style={{ color: myColors.text2, fontSize: 17, marginTop: 4 }}>
                Jataí, GO
              </MyText>
            </View>
          </View>
          <MyDivider
            style={{
              backgroundColor: myColors.divider2,
              marginTop: 4,
              marginHorizontal: 16,
            }}
          />
        </View>
      ))}
    </View>
  );
}

export default Devices;
