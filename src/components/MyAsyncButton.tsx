import MyButton, { MyButtonBaseProps } from "./MyButton";
import { useAsyncAction } from "~/hooks/useAsyncAction";

export type MyAsyncButtonBase = MyButtonBaseProps & {
  onPress: () => Promise<void>;
};

/**
 *  This button set loading={true} while awaiting the onPress.
 *  On promise rejection shows an alert.
 **/
function MyAsyncButton({ onPress, ...props }: MyAsyncButtonBase) {
  const [action, loading] = useAsyncAction(onPress);

  return <MyButton onPress={action} loading={loading} {...props} />;
}

export default MyAsyncButton;
