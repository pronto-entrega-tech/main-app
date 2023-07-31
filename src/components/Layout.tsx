import React from 'react';
import MyToast from '~/components/MyToast';
import CartBar from '~/components/CartBar';
import NavigationBar from '~/components/NavigationBar';
import myColors from '~/constants/myColors';
import device from '~/constants/device';

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  backgroundColor: myColors.background,
};

export const WithToast = (Page: any) => {
  if (!device.web) return Page;

  const Layout = (props: any) => (
    <>
      <MyToast />
      <main style={baseStyle}>
        <Page {...props} />
      </main>
    </>
  );
  return Layout;
};

export const WithCartBar = (Page: any) => {
  if (!device.web) return Page;

  const Layout = (props: any) => (
    <>
      <MyToast />
      <main style={baseStyle}>
        <Page {...props} />
      </main>
      <CartBar toped />
    </>
  );
  return Layout;
};

export const WithBottomNav = (Page: any) => {
  if (!device.web) return Page;

  const Layout = (props: any) => (
    <BottomNav
      style={{
        ...baseStyle,
        paddingBottom: 54,
      }}>
      <Page {...props} />
    </BottomNav>
  );
  return Layout;
};

export const BottomNav = ({ children }: any) =>
  !device.web ? (
    children
  ) : (
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
