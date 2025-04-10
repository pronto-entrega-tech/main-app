import React from "react";
import MyHeader from "~/components/MyHeader";
import Portal from "~/components/Portal";
import { SinglePageTabs } from "~/components/SinglePageTabs";
import PaymentOnDelivery from "~/screens/PaymentOnDelivery";
import { PaymentMethodsBody } from "./meios-de-pagamento";
import { appOrSite } from "~/constants/device";
import { useCartContext } from "~/contexts/CartContext";
import { PaymentCard } from "~/core/models";
import useRouting from "~/hooks/useRouting";
import { formatCardBrand } from "~/functions/converter";

const PaymentTabs = () => (
  <Portal.Host>
    <SinglePageTabs
      header={<MyHeader title="Pagamento" dividerLess notchLess />}
      tabs={[
        {
          title: `Pagar pelo ${appOrSite}`,
          element: <PaymentOnApp />,
        },
        { title: "Pagar na entrega", element: <PaymentOnDelivery /> },
      ]}
    />
  </Portal.Host>
);

export const PaymentOnApp = () => {
  const { goBack } = useRouting();
  const { setPayment } = useCartContext();

  const selectPayment = (card?: PaymentCard) => {
    setPayment({
      inApp: true,
      ...(card
        ? {
            description: `Crédito ${formatCardBrand(card)} •••• ${card.last4}`,
            method: "CARD",
            cardId: card.id,
          }
        : {
            description: "PIX",
            method: "PIX",
          }),
    });
    goBack();
  };

  return (
    <PaymentMethodsBody
      onPixPress={selectPayment}
      onCardPress={selectPayment}
    />
  );
};

export default PaymentTabs;
