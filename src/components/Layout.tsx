import React from 'react';
import MyToast from '~/components/MyToast';
import CartBar from '~/components/CartBar';
import NavigationBar from '~/components/NavigationBar';
import myColors from '~/constants/myColors';
import device from '~/constants/device';
import TabBar, { Tabs } from './TabBar';
import Header from './Header';
import { View } from 'react-native';
import globalStyles from '~/constants/globalStyles';
import ProductHeader from './ProductHeader';

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  backgroundColor: myColors.background,
};

export function WithCartBar(Page: any) {
  if (!device.web) return Page;
  Page.getLayout = function getLayout({ children }: any) {
    return (
      <>
        <MyToast />
        <main style={baseStyle}>{children}</main>
        <CartBar toped />
      </>
    );
  };
  return Page;
}

export function WithBottomNav(Page: any) {
  if (!device.web) return Page;
  Page.getLayout = function getLayout({ children }: any) {
    return (
      <>
        <MyToast />
        <main
          style={{
            ...baseStyle,
            paddingBottom: 54,
          }}>
          {children}
        </main>
        <CartBar toped />
        <NavigationBar />
      </>
    );
  };
  return Page;
}

export function WithTabBar(
  Page: any,
  tabs: Tabs,
  Header: React.FC,
  hasCartBar?: boolean
) {
  if (!device.web) return Page;
  Page.getLayout = function getLayout({ children }: any) {
    return (
      <>
        <MyToast />
        <View
          style={[
            globalStyles.elevation3,
            {
              position: 'sticky' as any,
              top: 0,
              zIndex: 1,
              width: '100%',
            },
          ]}>
          <Header />
          <TabBar tabs={tabs} />
        </View>
        <main style={baseStyle}>{children}</main>
        {hasCartBar && <CartBar />}
      </>
    );
  };
  return Page;
}

export function WithPaymentTabBar(Page: any) {
  const paymentTabs = () => [
    { title: 'Pagar no app', path: '/pagamento' },
    {
      title: 'Pagar na entrega',
      path: '/pagamento-entrega',
    },
  ];
  const header = () => <Header title={'Formas de pagamento'} />;

  return WithTabBar(Page, paymentTabs, header);
}

export function WithProductTabBar(Page: any) {
  const productTabs = (params: any) => {
    const _params = `/${params.city}/${params.marketId}/${params.prodId}`;
    const __params = _params === '///' ? '' : _params;

    return [
      {
        title: 'Produto',
        path: `/produto${__params}`,
        pathname: '/produto/[city]/[marketId]/[prodId]',
      },
      {
        title: 'Mercado',
        path: `/produto${__params}/mercado`,
        pathname: '/produto/[city]/[marketId]/[prodId]/mercado',
      },
    ];
  };
  const header = () => <ProductHeader />;

  return WithTabBar(Page, productTabs, header, true);
}
