import { useCallback, useState } from "react";
import { createContext } from "~/contexts/createContext";
import {
  CreatePaymentCard,
  PaymentCard,
  UpdatePaymentCard,
} from "~/core/models";
import { api } from "~/services/api";

function usePaymentCard() {
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

  const deletePaymentCard = async (token: string, id: PaymentCard["id"]) => {
    await api.paymentCards.remove(token, id);

    if (paymentCards) setPaymentCards(paymentCards.filter((a) => a.id !== id));
  };

  return {
    paymentCards,
    loadPaymentCards: useCallback(loadPaymentCards, [paymentCards]),
    createPaymentCard: useCallback(createPaymentCard, [paymentCards]),
    updatePaymentCard: useCallback(updatePaymentCard, [paymentCards]),
    deletePaymentCard: useCallback(deletePaymentCard, [paymentCards]),
  };
}

export const [
  PaymentCardProvider,
  usePaymentCardContext,
  usePaymentCardContextSelector,
] = createContext(usePaymentCard);
