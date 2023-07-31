import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { globalStyles, myColors } from '~/constants';
import MyText from './MyText';

const Loading = ({ title }: { title?: string }) => (
  <View style={[globalStyles.centralizer, { minHeight: 150 }]}>
    {!!title && <MyText style={_styles.loading}>{title}</MyText>}
    <ActivityIndicator color={myColors.loading} size='large' />
  </View>
);

const _styles = StyleSheet.create({
  loading: {
    color: myColors.text3,
    fontSize: 16,
    marginBottom: 16,
  },
});

export default Loading;
