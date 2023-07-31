import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import Input from 'react-native-elements/dist/input/Input'; // react-native-elements don't tree shake
import { myColors } from '~/constants';

type InputArgs = Omit<Parameters<typeof Input>[0], 'ref' | 'autoCompleteType'> &
  Pick<TextInputProps, 'autoComplete'>;

const MyInput = (props: InputArgs & { _ref?: React.RefObject<TextInput> }) => (
  <Input
    labelStyle={{ color: myColors.primaryColor }}
    inputContainerStyle={{ borderBottomColor: '#aaa' }}
    selectionColor={myColors.colorAccent}
    ref={props._ref}
    {...(props as any)}
  />
);

export default MyInput;
