import React from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { device, myColors } from '~/constants';
import MyIcon from './MyIcon';
import MyDivider from './MyDivider';

function MyPicker({
  items,
  label,
  errorMessage = '',
  style,
  selectedValue = '-',
  onValueChange,
}: {
  items: string[];
  label: string;
  errorMessage?: string;
  style: StyleProp<ViewStyle>;
  selectedValue?: string;
  onValueChange: (v: string) => void;
}) {
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState(selectedValue);
  items = ['-', ...items];

  const PickerItems = () => {
    return items.map((item, i) => {
      return (
        <Picker.Item
          key={item}
          label={item}
          value={item}
          color={i === 0 ? '#9EA0A4' : myColors.text4_5}
          style={{ fontSize: 18 }}
        />
      );
    });
  };

  if (device.iOS)
    return (
      <View style={[styles.conteiner, style]}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={() => setVisible(true)}>
          <Text style={styles.input}>{value}</Text>
          <MyIcon name='menu-down' color='#777' style={{ marginRight: 12 }} />
        </TouchableOpacity>
        <MyDivider style={styles.divider} />
        <Text style={styles.error}>{errorMessage}</Text>
        <Modal transparent visible={visible} animationType='slide'>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
          />
          <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <View style={styles.toolbar}>
              <Pressable onPress={() => setVisible(false)}>
                <Text style={styles.done}>Done</Text>
              </Pressable>
            </View>
            <Picker
              style={{ backgroundColor: '#d0d4da' }}
              selectedValue={value}
              onValueChange={(v) => {
                onValueChange(v);
                setValue(v);
              }}>
              {PickerItems()}
            </Picker>
          </View>
        </Modal>
      </View>
    );

  if (device.web)
    return (
      <View style={[styles.conteiner, style]}>
        <Text style={styles.label}>{label}</Text>
        <Picker
          style={{ height: 52, paddingVertical: 8, zIndex: 2, opacity: 0 }}
          selectedValue={value}
          onValueChange={(v) => {
            onValueChange(v);
            setValue(v);
          }}>
          {PickerItems()}
        </Picker>
        <View
          style={{
            marginTop: -52,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: 46,
          }}>
          <Text style={styles.input}>{value}</Text>
          <MyIcon name='menu-down' color='#777' style={{ marginRight: 12 }} />
        </View>
        <MyDivider style={styles.divider} />
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    );

  return (
    <View style={[styles.conteiner, style]}>
      <Text style={[styles.label, { marginBottom: 10 }]}>{label}</Text>
      <Picker
        mode='dropdown'
        selectedValue={value}
        onValueChange={(v) => {
          onValueChange(v);
          setValue(v);
        }}>
        {PickerItems()}
      </Picker>
      <MyDivider style={[styles.divider, { top: 8 }]} />
      <Text style={styles.error}>{errorMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteiner: {
    marginLeft: 3,
  },
  label: {
    color: myColors.primaryColor,
    marginLeft: 7,
    alignSelf: 'flex-start',
    fontSize: 16,
    fontFamily: 'Bold',
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    fontSize: 17,
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginLeft: 12,
  },
  divider: {
    top: -6,
    marginLeft: 6,
    marginRight: 10,
    height: 1,
    backgroundColor: '#aaa',
  },
  toolbar: {
    height: 45,
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#dedede',
    zIndex: 2,
  },
  done: {
    color: '#007aff',
    fontWeight: '600',
    fontSize: 17,
    paddingTop: 1,
    paddingRight: 11,
  },
});

export default MyPicker;
