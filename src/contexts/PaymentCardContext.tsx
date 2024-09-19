import React, { ReactNode, useCallback, useState } from 'react';
import { createContext } from 'use-context-selector';
import {
  CreatePaymentCard,
  PaymentCard,
  UpdatePaymentCard,
} from '~/core/models';
import { createUseContext } from '~/contexts/createUseContext';
import { api } from '~/services/api';

type PaymentCardContextValues = {
  paymentCards?: PaymentCard[];
  loadPaymentCards: (token: string) => Promise<void>;
  createPaymentCard: (token: string, card: CreatePaymentCard) => Promise<void>;
  updatePaymentCard: (token: string, card: UpdatePaymentCard) => Promise<void>;
  deletePaymentCard: (token: string, id: PaymentCard['id']) => Promise<void>;
};

const PaymentCardContext = createContext({} as PaymentCardContextValues);

export const usePaymentCardContext = createUseContext(PaymentCardContext);

export const PaymentCardProvider = (props: { children: ReactNode }) => {
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>();

  const loadPaymentCards = async (token: string) => {
    if (paymentCards) return;

    const _paymentCards = await api.paymentCards.find(token);
    setPaymentCards(_paymentCards);
  };

  const createPaymentCard = async (token: string, card: CreatePaymentCard) => {
    const _card = await api.paymentCards.create(token, card);

    if (paymentCards) setPaymentCards([...paymentCards, _card]);
  };

  const updatePaymentCard = async (token: string, card: UpdatePaymentCard) => {
    await api.paymentCards.update(token, card);

    if (paymentCards)
      setPaymentCards(
        paymentCards.map((c) => (c.id === card.id ? { ...c, ...card } : c)),
      );
  };

  const deletePaymentCard = async (token: string, id: PaymentCard['id']) => {
    await api.paymentCards.remove(token, id);

    if (paymentCards) setPaymentCards(paymentCards.filter((a) => a.id !== id));
  };

  return (
    <PaymentCardContext.Provider
      value={{
        paymentCards,
        loadPaymentCards: useCallback(loadPaymentCards, [paymentCards]),
        createPaymentCard: useCallback(createPaymentCard, [paymentCards]),
        updatePaymentCard: useCallback(updatePaymentCard, [paymentCards]),
        deletePaymentCard: useCallback(deletePaymentCard, [paymentCards]),
      }}
      {...props}
    />
  );
};
