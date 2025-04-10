import React, { useState } from "react";
import MyButton, { MyButtonBaseProps } from "./MyButton";
import { serverError } from "./Errors";
import { useAlertContext } from "~/contexts/AlertContext";

export type MyAsyncButtonBase = MyButtonBaseProps & {
  onPress: () => Promise<void>;
};

/**
 *  This button set loading={true} while awaiting the onPress.
 *  On promise rejection shows an alert.
 **/
function MyAsyncButton({ onPress, ...props }: MyAsyncButtonBase) {
  const { alert } = useAlertContext();

  const [loading, setLoading] = useState(false);
  const action = async () => {
    try {
      setLoading(true);
      await onPress();
    } catch {
      serverError(alert);
    } finally {
      setLoading(false);
    }
  };

  return <MyButton onPress={action} loading={loading} {...props} />;
}

export default MyAsyncButton;
