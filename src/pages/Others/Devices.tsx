import React from 'react';
import { Platform, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyText from '../../components/MyText';
import { device, myColors } from '../../constants';

interface deviceModel {
  icon: string,
  name: string,
  time: string,
}

function Devices() {
  const data: deviceModel[] = [
    {icon: device.android? 'cellphone-android' : device.iOS? 'cellphone-iphone' : 'monitor',
    name: Platform.OS == 'android'? Platform.constants.Model : Platform.OS == 'ios'? Platform.constants.systemName : 'Web', time: ''},
  ]

  return (
    <View style={{backgroundColor: myColors.background, flex: 1}}>
      <MyText style={{alignSelf: 'center', textAlign: 'center', fontSize: 18, color: myColors.text2, marginTop: 20, marginBottom: 20}} >{'Dispositivos em que sua conta\nfoi conectada'}</MyText>
      {
        data.map((item, i) => (
          <View key={i} >
            <View style={{flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center'}} >
              <Icon name={item.icon} color='#636363' size={32} />
              <View style={{marginLeft: 16, flexGrow: 1}} >
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}} >
                  <MyText style={{color: myColors.text4, fontSize: 17}} >{item.name}</MyText>
                  <MyText style={{color: i == 0? '#44aa44' : '#999', fontSize: 12, marginLeft: 8, marginBottom: 2, fontFamily: 'Medium'}} >
                    {i == 0? 'Dispositivo atual': 'Há '+item.time}
                  </MyText>
                </View>
                <MyText style={{color: myColors.text2, fontSize: 17, marginTop: 4}} >Jataí, GO</MyText>
              </View>
            </View>
            <Divider style={{backgroundColor: myColors.divider2, height: 1, marginTop: 4, marginHorizontal: 16}} />
          </View>
        ))
      }
    </View>
  )
}

export default Devices