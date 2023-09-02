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
  fallback,
  onGoBack,
  goBackLess,
  notchLess,
  dividerLess,
  smallDivider,
  rightIcon,
}: {
  title?: string;
  fallback?: string;
  onGoBack?: () => void;
  goBackLess?: boolean;
  notchLess?: boolean;
  dividerLess?: boolean;
  smallDivider?: boolean;
  rightIcon?: ReactNode;
}) => {
  const routing = useRouting();
  const goBack = onGoBack ?? routing.goBack;

  return (
    <HeaderContainer>
      <View style={[styles.header, !notchLess && globalStyles.notch]}>
        {!goBackLess && (
          <IconButton
            icon='arrow-left'
            type='back'
            onPress={() => goBack(fallback)}
          />
        )}
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
