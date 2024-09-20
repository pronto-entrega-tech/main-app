import React, { ReactNode, ComponentType } from 'react';
import { MyProvider } from './MyContext';
import { AddressProvider } from '~/contexts/AddressContext';
import { AuthProvider } from '~/contexts/AuthContext';
import { FavoritesProvider } from '~/contexts/FavoritesContext';
import { CartProvider } from '~/contexts/CartContext';
import { ChatProvider } from '~/contexts/ChatContext';
import { OrderProvider } from '~/contexts/OrderContext';
import { PaymentCardProvider } from '~/contexts/PaymentCardContext';
import { HasNavigatedProvider } from '~/contexts/HasNavigatedContext';

export const AppContexts = (p: { children: ReactNode }) =>
  nestComponents(p.children, [
    MyProvider,
    HasNavigatedProvider,
    AddressProvider,
    AuthProvider,
    FavoritesProvider,
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
