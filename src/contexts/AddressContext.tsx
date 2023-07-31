import React, { useCallback, useEffect, useState } from 'react';
import { createContext } from 'use-context-selector';
import { getActiveAddress, saveActiveAddress } from '~/core/dataStorage';
import { Address, SetState } from '~/core/models';
import { createUseContext } from '~/functions/converter';
import { api } from '~/services/api';

type AddressContextValues = {
  address?: Address | null;
  setAddress: SetState<Address>;
  addresses?: Address[];
  loadAddresses: (token: string) => Promise<void>;
  createAddress: (token: string, address: Address) => Promise<void>;
  updateAddress: (token: string, address: Address) => Promise<void>;
  deleteAddress: (token: string, id: Address['id']) => Promise<void>;
};

const AddressContext = createContext({} as AddressContextValues);

export const useAddressContext = createUseContext(AddressContext);

export const AddressProvider = (props: any) => {
  const [address, _setAddress] = useState<Address | null>();
  const [addresses, setAddresses] = useState<Address[]>();

  const setAddress = (v: Address) => {
    _setAddress(v);
    saveActiveAddress(v);
  };

  useEffect(() => {
    getActiveAddress().then(_setAddress);
  }, []);

  const loadAddresses = async (token: string) => {
    if (addresses) return;

    const _addresses = await api.addresses.find(token);

    setAddresses(_addresses);
  };

  const createAddress = async (token: string, address: Address) => {
    const { id } = await api.addresses.create(token, address);

    if (addresses) setAddresses([...addresses, { ...address, id }]);
  };

  const updateAddress = async (token: string, address: Address) => {
    await api.addresses.update(token, address);

    if (addresses)
      setAddresses(addresses.map((a) => (a.id === address.id ? address : a)));
  };

  const deleteAddress = async (token: string, id: Address['id']) => {
    await api.addresses.remove(token, id);

    if (addresses) setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <AddressContext.Provider
      value={{
        address,
        setAddress,
        addresses,
        loadAddresses: useCallback(loadAddresses, [addresses]),
        createAddress: useCallback(createAddress, [addresses]),
        updateAddress: useCallback(updateAddress, [addresses]),
        deleteAddress: useCallback(deleteAddress, [addresses]),
      }}
      {...props}
    />
  );
};
