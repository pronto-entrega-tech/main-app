import React, { ReactNode } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { device } from '~/constants';

const IOSKeyboardAvoidingView = (p: { children: ReactNode }) => {
  return device.iOS ? (
    <KeyboardAvoidingView behavior='height' style={{ flex: 1 }}>
      {p.children}
    </KeyboardAvoidingView>
  ) : (
    <>{p.children}</>
  );
};

export default IOSKeyboardAvoidingView;
