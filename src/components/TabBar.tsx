import React from 'react';
import { View } from 'react-native';
import { globalStyles, myColors } from '~/constants';
import MyTouchable from './MyTouchable';
import MyText from './MyText';
import useRouting from '~/hooks/useRouting';
import MyDivider from './MyDivider';

export type Tabs = (params: any) => {
  title: string;
  path: string;
  pathname?: string;
}[];
function TabBar({ tabs }: { tabs: Tabs }) {
  const { pathname: _pathname, params } = useRouting();

  return (
    <View
      style={[
        {
          backgroundColor: 'white',
          height: 48,
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
        },
      ]}>
      {tabs(params).map(({ title, path, pathname }) => {
        const isSelected = pathname ?? path === _pathname;
        return (
          <MyTouchable
            key={title}
            style={{
              flex: 1,
              height: '100%',
              alignItems: 'center',
            }}
            path={path}
            params={params}>
            <View style={globalStyles.centralizer}>
              <MyText
                style={{
                  fontSize: 13,
                  letterSpacing: 0.5,
                  color: 'rgb(80, 80, 80)',
                  opacity: isSelected ? 1 : 0.5,
                }}>
                {title.toUpperCase()}
              </MyText>
            </View>
            <MyDivider
              style={{
                height: 2,
                backgroundColor: isSelected
                  ? myColors.primaryColor
                  : 'transparent',
              }}
            />
          </MyTouchable>
        );
      })}
    </View>
  );
}

export default TabBar;
