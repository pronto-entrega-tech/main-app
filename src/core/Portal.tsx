import React, { useEffect, useState } from 'react';
import { SetState } from './models';

type PortalValues = {
  setGates: SetState<React.ReactNode>;
};
const PortalContext = React.createContext({} as PortalValues);

const Portal = ({ children }: { children: React.ReactNode }) => {
  const { setGates } = React.useContext(PortalContext);

  useEffect(() => {
    if (setGates) setGates(children);
  }, [children, setGates]);

  return null;
};

const Host = (props: { children: React.ReactNode }) => {
  const [gates, setGates] = useState<React.ReactNode>();

  return (
    <PortalContext.Provider value={{ setGates }}>
      {props.children}
      {gates}
    </PortalContext.Provider>
  );
};
Portal.Host = Host;

export default Portal;
