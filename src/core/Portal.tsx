import React, { useEffect, useState } from 'react';

interface PortalValues {
  setGates: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}
const PortalContext = React.createContext({} as PortalValues);

function Portal(props: { children: React.ReactNode }) {
  const { children } = props;
  const { setGates } = React.useContext(PortalContext);

  useEffect(() => {
    if (setGates) setGates(children);
  }, [children, setGates]);

  // `void` is not a valid JSX element
  return null;
}

Portal.Host = function PortalHost(props: { children: React.ReactNode }) {
  const [gates, setGates] = useState<React.ReactNode>();

  return (
    <PortalContext.Provider value={{ setGates }}>
      {props.children}
      {gates}
    </PortalContext.Provider>
  );
};

export default Portal;
