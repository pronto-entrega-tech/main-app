import React from 'react';
import { View } from 'react-native';
import { globalStyles, myColors } from '~/constants';
import MyTouchable from './MyTouchable';
import MyText from './MyText';
import MyIcon from './MyIcon';
import useRouting from '~/hooks/useRouting';

function NavigationBar() {
  const { pathname } = useRouting();

  const tabs = [
    { title: 'Início', path: '/inicio', icon: 'home' },
    { title: 'Categorias', path: '/categorias', icon: 'view-grid' },
    { title: 'Compras', path: '/compras', icon: 'shopping' },
    { title: 'Perfil', path: '/perfil', icon: 'account' },
  ] as const;

  return (
    <View
      style={[
        globalStyles.elevation3,
        {
          backgroundColor: 'white',
          height: 54,
          width: '100%',
          position: 'fixed' as any,
          bottom: 0,
          alignItems: 'center',
        },
      ]}>
      <View
        style={{
          height: '100%',
          width: '100%',
          maxWidth: 384,
          flexDirection: 'row',
        }}>
        {tabs.map(({ title, path, icon }) => {
          const isSelected = pathname.startsWith(path);
          const color = isSelected
            ? myColors.primaryColor
            : 'rgba(0, 0, 0, 0.5)';
          return (
            <MyTouchable
              key={title}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: 8,
                paddingBottom: 6,
              }}
              path={path}>
              <MyIcon
                name={isSelected ? icon : `${icon}-outline`}
                color={color}
              />
              <MyText
                style={{
                  marginTop: 24,
                  position: 'absolute',
                  color,
                  fontSize: 12,
                }}>
                {title}
              </MyText>
            </MyTouchable>
          );
        })}
      </View>
    </View>
  );
}

export default NavigationBar;
