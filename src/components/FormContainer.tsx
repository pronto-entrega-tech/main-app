import React from 'react';
import { ScrollView } from 'react-native';
import { device, globalStyles, myColors } from '~/constants';

const FormContainer = (props: any) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={[
      globalStyles.container,
      device.web && { backgroundColor: myColors.background },
    ]}
    {...props}
  />
);

export default FormContainer;
