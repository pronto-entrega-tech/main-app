import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { RadioButton } from "react-native-paper";
import MyHeader from "~/components/MyHeader";
import MyButton from "~/components/MyButton";
import MyDivider from "~/components/MyDivider";
import { myColors, device } from "~/constants";
import useRouting from "~/hooks/useRouting";
import MyText from "~/components/MyText";
import { isScheduleEqual } from "~/functions/converter";
import { useCartContext } from "~/contexts/CartContext";
import { OrderSchedule } from "~/core/models";

const Schedule = () => {
  const { goBack, replace } = useRouting();
  const { activeSchedule, schedules, setActiveSchedule } = useCartContext();
  const [localSchedule, setLocalSchedule] = useState(activeSchedule);

  useEffect(() => {
    if (!schedules) replace("Cart");
  }, [replace, schedules]);

  const schedulesObject =
    schedules?.reduce(
      (m, s) => {
        const a = m[s.dayText] ?? [];
        return { ...m, [s.dayText]: [...a, s] };
      },
      {} as { [x: string]: OrderSchedule[] },
    ) ?? {};

  const schedulesMap = Object.entries(schedulesObject);
  const [selectedDay, setSelectedDay] = useState(schedulesMap[0]?.[0]);

  return (
    <View style={{ backgroundColor: myColors.background, flex: 1 }}>
      <MyHeader title="Agendamento" />
      <View style={{ flexDirection: "row", paddingTop: 22, paddingBottom: 18 }}>
        {schedulesMap.map(([day]) => (
          <MyButton
            key={day}
            title={day}
            type={day === selectedDay ? "solid" : "outline"}
            onPress={() => setSelectedDay(day)}
            buttonStyle={{ marginLeft: 16, width: 100 }}
          />
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.paddingBottom}
      >
        <MyText style={styles.title}>Escolha um horário</MyText>
        {schedulesObject[selectedDay]?.map((item, index) => (
          <View key={item.hours}>
            {index !== 0 && <MyDivider style={styles.divider} />}
            <RadioButton.Item
              label={item.hours}
              labelStyle={styles.radioButton}
              color={myColors.primaryColor}
              uncheckedColor={myColors.grey}
              value=""
              status={
                isScheduleEqual(item, localSchedule) ? "checked" : "unchecked"
              }
              onPress={() => setLocalSchedule(item)}
            />
          </View>
        ))}
      </ScrollView>
      <MyButton
        title="Confirmar"
        type="outline"
        disabled={isScheduleEqual(localSchedule, activeSchedule)}
        buttonStyle={styles.button}
        onPress={() => {
          setActiveSchedule(localSchedule);
          goBack("Cart");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 16,
    marginVertical: 2,
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
    backgroundColor: "#fff",
    position: "absolute",
    alignSelf: "center",
  },
});

export default Schedule;
