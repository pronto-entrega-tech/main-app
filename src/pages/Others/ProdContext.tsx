import React from 'react';
import { prodModel } from '../../components/ProdItem';

interface contextModel {
  item: prodModel,
  merc: number,
}

const ProdContext = React.createContext<contextModel | undefined>(undefined);

function useProdContext() {
  const context = React.useContext(ProdContext)
  if (!context) {
    throw new Error(`useProdContext must be used within a ProdContext`)
  }
  return context
}

function useProdContext2() {
  return React.useContext(ProdContext)
}

export {
  useProdContext,
  useProdContext2,
  ProdContext,
}