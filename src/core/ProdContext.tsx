import React from 'react';
import { Product } from '~/components/ProdItem';

interface ProdValue {
  product: Product;
}

const ProdContext = React.createContext<ProdValue | null>(null);

function useProdContext() {
  const context = React.useContext(ProdContext);
  if (!context) {
    throw new Error(`useProdContext must be used within a ProdContext`);
  }
  return context;
}

function useProdContext2() {
  return React.useContext(ProdContext);
}

export { useProdContext, useProdContext2, ProdContext };
