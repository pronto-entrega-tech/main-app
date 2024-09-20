import React from "react";
import Loading from "~/components/Loading";
import { useAuthContext } from "~/contexts/AuthContext";
import useRouting from "~/hooks/useRouting";
import { api } from "~/services/api";

const ValidateCode = () => {
  const {
    params: { key, authCode },
    replace,
  } = useRouting();
  const { signIn } = useAuthContext();

  if (key && authCode) {
    api.auth.validate(key, authCode).then((res) => {
      if (res.type === "ACCESS")
        signIn({
          accessToken: res.token,
          refreshToken: res.session?.refresh_token,
        });

      replace("Home");
    });
  } else {
    replace("SignIn");
  }

  return <Loading />;
};

export default ValidateCode;
