import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import MyButton from '../../components/MyButton';
import { myColors, device } from '../../constants';
import { scheduleModel } from './Cart';

function Schedule({ navigation, route }:
  {navigation: StackNavigationProp<any, any>, route: any}) {
  const [activeSchedule, setActiveSchedule] = useState<scheduleModel | null>(null);
  const list: scheduleModel[] = route.params.list;

  useEffect(() => {
    setActiveSchedule(route.params.active)
  }, []);

  return (
    <View style={{backgroundColor: myColors.background, flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false} >
        <Text style={styles.title}>Escolha um horário</Text>
        {
          list.map((item, index) => (
            <View key={index} >
              {index != 0?
              <Divider style={styles.divider} /> : null}
              <RadioButton.Item
                label={item.horarios}
                labelStyle={styles.radioButton}
                uncheckedColor={myColors.grey}
                value=''
                color={myColors.primaryColor}
                status={item === activeSchedule ? 'checked' : 'unchecked' }
                onPress={() => {item === activeSchedule ? setActiveSchedule(null) : setActiveSchedule(item)}} />
            </View>
          ))
        }
      </ScrollView>
      <MyButton
        title={'Confirmar'}
        type='outline'
        disabled={route.params.active === activeSchedule}
        buttonStyle={styles.button}
        onPress={() => {
          navigation.navigate('Cart', {callback: 'activeSchedule', value: activeSchedule});
        }} />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    marginLeft: 16,
    marginTop: 14,
    marginBottom: 2,
    fontSize: 18,
    color: myColors.text5,
  },
  divider: {
    marginHorizontal: 10,
    color: myColors.divider
  },
  radioButton: {
    color: myColors.text5
  },
  button: {
    borderWidth: 2,
    width: 210,
    height: 46,
    backgroundColor: '#fff',
    position: 'absolute',
    alignSelf: 'center',
    bottom: device.iPhoneNotch ? 38 : 12
  }
})

export default Schedule