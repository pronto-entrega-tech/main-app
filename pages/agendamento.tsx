import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Header from '~/components/Header';
import MyButton from '~/components/MyButton';
import MyDivider from '~/components/MyDivider';
import { myColors, device } from '~/constants';
import useRouting from '~/hooks/useRouting';
import { scheduleModel } from './carrinho';

function Schedule() {
  const routing = useRouting();
  const [activeSchedule, setActiveSchedule] = useState<
    scheduleModel | undefined
  >(routing.params.active);
  const list: scheduleModel[] = JSON.parse(routing.params.list ?? '{}');

  return (
    <View
      style={{
        backgroundColor: myColors.background,
        flex: 1,
      }}>
      <Header title={'Agendameto'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.paddingBottom}>
        <Text style={styles.title}>Escolha um horário</Text>
        {!!list?.length &&
          list.map((item, index) => (
            <View key={item.horarios}>
              {index !== 0 && <MyDivider style={styles.divider} />}
              <RadioButton.Item
                label={item.horarios}
                labelStyle={styles.radioButton}
                color={myColors.primaryColor}
                uncheckedColor={myColors.grey}
                value=''
                status={
                  item.horarios === activeSchedule?.horarios
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => {
                  setActiveSchedule(
                    item.horarios === activeSchedule?.horarios
                      ? undefined
                      : item
                  );
                }}
              />
            </View>
          ))}
      </ScrollView>
      <MyButton
        title='Confirmar'
        type='outline'
        disabled={isScheduleEqual(routing.params.active, activeSchedule)}
        buttonStyle={styles.button}
        onPress={() => {
          routing.navigate('/carrinho', {
            callback: 'activeSchedule',
            value: JSON.stringify(activeSchedule),
          });
        }}
      />
    </View>
  );
}

export function isScheduleEqual(
  schedule1?: scheduleModel,
  schedule2?: scheduleModel
) {
  return (
    schedule1?.diaDoMes === schedule2?.diaDoMes &&
    schedule1?.horarios === schedule2?.horarios
  );
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
  },
  radioButton: {
    color: myColors.text5,
  },
  paddingBottom: {
    paddingBottom: 46 + (device.iPhoneNotch ? 38 : 12),
  },
  button: {
    height: 46,
    bottom: device.iPhoneNotch ? 38 : 12,
    borderWidth: 2,
    width: 210,
    backgroundColor: '#fff',
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default Schedule;
