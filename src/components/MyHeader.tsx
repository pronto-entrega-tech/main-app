import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import useRouting from '~/hooks/useRouting';
import { myColors, globalStyles, myFonts } from '~/constants';
import IconButton from './IconButton';
import MyDivider from './MyDivider';
import MyText from './MyText';
import HeaderContainer from './HeaderContainer';

const MyHeader = ({
  title,
  onGoBack,
  goBackLess,
  notchLess,
  dividerLess,
  smallDivider,
  rightIcon,
}: {
  title?: string;
  onGoBack?: () => void;
  goBackLess?: boolean;
  notchLess?: boolean;
  dividerLess?: boolean;
  smallDivider?: boolean;
  rightIcon?: ReactNode;
}) => {
  return (
    <HeaderContainer>
      <View style={[styles.header, !notchLess && globalStyles.notch]}>
        {!goBackLess && <GoBackButton onGoBack={onGoBack} />}
        <MyText style={styles.textHeader}>{title}</MyText>
        <View style={styles.rightIcon}>{rightIcon}</View>
      </View>
      {!dividerLess && (
        <MyDivider
          style={[styles.divider, { marginHorizontal: smallDivider ? 16 : 0 }]}
        />
      )}
    </HeaderContainer>
  );
};

export const GoBackButton = (p: { onGoBack?: () => void }) => {
  const routing = useRouting();
  const goBack = p.onGoBack ?? routing.goBack;
  return (
    <IconButton
      onPress={() => goBack()}
      icon='arrow-left'
      style={{
        width: 56,
        height: 56,
      }}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: myColors.background,
    justifyContent: 'center',
    height: 56,
  },
  textHeader: {
    color: myColors.primaryColor,
    fontSize: 20,
    fontFamily: myFonts.Bold,
    position: 'absolute',
    alignSelf: 'center',
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
  },
  divider: {
    backgroundColor: myColors.divider2,
    marginTop: -1,
  },
});

export default MyHeader;
