import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SetState } from "./models";

type PortalValues = {
  setGates: SetState<ReactNode>;
};
const PortalContext = createContext({} as PortalValues);

const Portal = ({ children }: { children: ReactNode }) => {
  const { setGates } = useContext(PortalContext);

  useEffect(() => {
    if (setGates) setGates(children);
  }, [children, setGates]);

  return null;
};

const Host = (props: { children: ReactNode }) => {
  const [gates, setGates] = useState<ReactNode>();

  return (
    <PortalContext.Provider value={{ setGates }}>
      {props.children}
      {gates}
    </PortalContext.Provider>
  );
};
Portal.Host = Host;

export default Portal;
