import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useRouting from '~/hooks/useRouting';
import { myColors, globalStyles } from '~/constants';
import IconButton from './IconButton';
import MyDivider from './MyDivider';

function Header({
  title = '',
  fallback = '/inicio',
  divider = true,
  goBack = true,
  notchless = false,
}: {
  navigation?: StackNavigationProp<any, any>;
  title?: string;
  fallback?: string;
  divider?: boolean;
  goBack?: boolean;
  notchless?: boolean;
}) {
  const routing = useRouting();
  return (
    <View style={[styles.header, !notchless && globalStyles.notch]}>
      {goBack && (
        <IconButton
          icon='arrow-left'
          type='back'
          onPress={() => {
            routing.goBack(fallback);
          }}
        />
      )}
      <Text style={styles.textHeader}>{title}</Text>
      {divider && <MyDivider style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    minHeight: 56,
    backgroundColor: myColors.background,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
  },
  divider: {
    backgroundColor: myColors.divider2,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default Header;
