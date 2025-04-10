import { useCallback, useEffect, useState } from "react";
import { getActiveAddress, saveActiveAddress } from "~/services/localStorage";
import { Address } from "~/core/models";
import { createContext } from "~/contexts/createContext";
import { api } from "~/services/api";

function useAddress() {
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

  const deleteAddress = async (token: string, id: Address["id"]) => {
    await api.addresses.remove(token, id);

    if (addresses) setAddresses(addresses.filter((a) => a.id !== id));
  };

  return {
    address,
    setAddress,
    addresses,
    loadAddresses: useCallback(loadAddresses, [addresses]),
    createAddress: useCallback(createAddress, [addresses]),
    updateAddress: useCallback(updateAddress, [addresses]),
    deleteAddress: useCallback(deleteAddress, [addresses]),
  };
}

export const [AddressProvider, useAddressContext, useAddressContextSelector] =
  createContext(useAddress);
