import React, { CSSProperties, ComponentType, ReactNode } from "react";
import MyToast from "~/components/MyToast";
import CartBar from "~/components/CartBar";
import NavigationBar from "~/components/NavigationBar";
import myColors from "~/constants/myColors";
import device from "~/constants/device";

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  backgroundColor: myColors.background,
} satisfies CSSProperties;

export const WithToast = (Page: ComponentType) => {
  if (!device.web) return Page;

  const Layout: ComponentType = (props) => (
    <>
      <main style={baseStyle}>
        <Page {...props} />
      </main>
      <MyToast />
    </>
  );
  return Layout;
};

export const WithCartBar = (Page: ComponentType) => {
  if (!device.web) return Page;

  const Layout: ComponentType = (props) => (
    <>
      <main style={baseStyle}>
        <Page {...props} />
      </main>
      <MyToast />
      <CartBar toped />
    </>
  );
  return Layout;
};

export const WithBottomNav = (Page: ComponentType) => {
  if (!device.web) return Page;

  const Layout: ComponentType = (props) => (
    <BottomNav>
      <Page {...props} />
    </BottomNav>
  );
  return Layout;
};

export const BottomNav = (p: { children: ReactNode }) =>
  !device.web ? (
    p.children
  ) : (
    <>
      <main
        style={{
          ...baseStyle,
          paddingBottom: 54,
        }}
      >
        {p.children}
      </main>
      <MyToast />
      <CartBar toped />
      <NavigationBar />
    </>
  );
