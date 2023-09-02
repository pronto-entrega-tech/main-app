import React, { ReactNode, ComponentType } from 'react';
import { AddressProvider } from '~/contexts/AddressContext';
import { AuthProvider } from '~/contexts/AuthContext';
import { CartProvider } from '~/contexts/CartContext';
import { ChatProvider } from '~/contexts/ChatContext';
import { OrderProvider } from '~/contexts/OrderContext';
import { PaymentCardProvider } from '~/contexts/PaymentCardContext';
import { MyProvider as CommonProvider } from './MyContext';

export const AppContexts = (p: { children: ReactNode }) =>
  nestComponents(p.children, [
    CommonProvider,
    AddressProvider,
    AuthProvider,
    CartProvider,
    OrderProvider,
    ChatProvider,
    PaymentCardProvider,
  ]);

const nestComponents = (
  children: ReactNode,
  components: ComponentType<{ children: ReactNode }>[],
) =>
  components.reduceRight(
    (previous, Component) => <Component>{previous}</Component>,
    children,
  );
