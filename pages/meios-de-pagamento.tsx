import React from 'react';
import Header from '~/components/Header';
import { PaymentInApp } from './pagamento';

function PaymentMethods() {
  return (
    <>
      <Header title='Meios de pagamento' />
      <PaymentInApp />
    </>
  );
}

export default PaymentMethods;
