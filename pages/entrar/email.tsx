import React, { useEffect, useState } from "react";
import { StyleSheet, View, AppState } from "react-native";
import MyButton from "~/components/MyButton";
import MyInput from "~/components/MyInput";
import MyText from "~/components/MyText";
import { useAuthContext } from "~/contexts/AuthContext";
import { range } from "~/functions/range";
import useRouting from "~/hooks/useRouting";
import { api } from "~/services/api";
import { PageTitle } from "~/components/PageTitle";
import MyHeader from "~/components/MyHeader";
import * as Clipboard from "expo-clipboard";
import device from "~/constants/device";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import { match } from "ts-pattern";
import MyAsyncButton from "~/components/MyAsyncButton";

type Stage =
  | {
      type: "email";
    }
  | {
      type: "code";
      key: string;
    }
  | {
      type: "profile";
      createToken: string;
    };

type setState = (stage: Stage) => void;

export default function EmailSignInScreen() {
  const [stage, setState] = useState<Stage>({ type: "email" });

  return (
    <>
      <MyHeader />

      {match(stage)
        .with({ type: "email" }, () => <EmailStage setState={setState} />)
        .with({ type: "code" }, ({ key }) => (
          <CodeStage setState={setState} key={key} />
        ))
        .with({ type: "profile" }, ({ createToken }) => (
          <ProfileStage createToken={createToken} />
        ))
        .exhaustive()}
    </>
  );
}

function EmailStage({ setState }: { setState: setState }) {
  const [email, setEmail] = useState("");

  const submit = async () => {
    const res = await api.auth.email(email);

    setState({
      type: "code",
      key: res.key,
    });
  };

  return (
    <View style={[globalStyles.centralizer, { paddingHorizontal: 24 }]}>
      <PageTitle title="Entrar email" />

      <MyText style={{ fontSize: 18, marginBottom: 36 }}>
        Insira seu email
      </MyText>
      <MyInput
        onChangeText={setEmail}
        onSubmitEditing={submit}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        containerStyle={{ maxWidth: 400 }}
      />
      <MyAsyncButton
        buttonStyle={styles.continueButton}
        title="Continuar"
        disabled={!email}
        onPress={submit}
      />
    </View>
  );
}

function CodeStage({ setState, key }: { setState: setState; key: string }) {
  const { navigate } = useRouting();
  const { signIn } = useAuthContext();

  const [code, setCode] = useState("");
  const [hasCodeError, setCodeError] = useState(false);

  const submit = async (code: string) => {
    setCodeError(false);
    if (code.length < 5) return;

    try {
      const res = await api.auth.validate(key, code);

      if (res.type === "ACCESS") {
        signIn({
          accessToken: res.token,
          refreshToken: res.session?.refresh_token,
        });
        navigate("Home");
      } else {
        setState({
          type: "profile",
          createToken: res.token,
        });
      }
    } catch {
      setCode("");
      setCodeError(true);
    }
  };

  return (
    <View style={[globalStyles.centralizer, { paddingHorizontal: 24 }]}>
      <PageTitle title="Código de verificação" />

      <MyText style={{ fontSize: 18, marginBottom: 36 }}>
        Insira o código de verificação
      </MyText>

      <View style={{ marginLeft: 55 }}>
        <View style={{ position: "absolute", flexDirection: "row", left: -8 }}>
          {range(1, 5).map((n) => (
            <View key={n} style={styles.codeBorder} />
          ))}
        </View>
        <MyInput
          autoFocus
          maxLength={5}
          keyboardType="numeric"
          inputStyle={styles.codeInput}
          errorMessage={hasCodeError ? "Código inválido" : ""}
          value={code}
          onChangeText={submit}
          containerStyle={styles.codeInputContainer}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          errorStyle={{ fontSize: 14, marginTop: 16 }}
          cursorColor="transparent"
        />
      </View>
      {device.android && <PasteCodeButton onPaste={submit} />}
    </View>
  );
}

function ProfileStage({ createToken }: { createToken: string }) {
  const { navigate } = useRouting();
  const { signIn } = useAuthContext();

  const [name, setName] = useState("");

  const submit = async () => {
    const res = await api.customers.create(createToken, name);

    signIn({
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
    });
    navigate("Home");
  };

  return (
    <View style={[globalStyles.centralizer, { paddingHorizontal: 24 }]}>
      <PageTitle title="Cadastro" />

      <MyText style={{ fontSize: 18, marginBottom: 36 }}>
        Insira seu nome
      </MyText>

      <MyInput
        value={name}
        onChangeText={setName}
        onSubmitEditing={submit}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="name"
        containerStyle={{ maxWidth: 400 }}
      />
      <MyButton
        buttonStyle={styles.continueButton}
        title="Continuar"
        disabled={!name}
        onPress={submit}
      />
    </View>
  );
}

function PasteCodeButton(p: { onPaste: (code: string) => void }) {
  const [code, setCode] = useState<string>();

  useEffect(() => {
    const sub1 = AppState.addEventListener("focus", async () => {
      const string = await Clipboard.getStringAsync();
      if (string.match(/\d\d\d\d\d/)) setCode(string);
    });

    const sub2 = Clipboard.addClipboardListener(async ({ contentTypes }) => {
      if (!contentTypes.includes(Clipboard.ContentType.PLAIN_TEXT)) return;

      const string = await Clipboard.getStringAsync();
      if (string.match(/\d\d\d\d\d/)) setCode(string);
    });

    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  return (
    <MyButton
      buttonStyle={styles.continueButton}
      title={code ? `Colar código ${code}` : "Colar código"}
      disabled={code == null}
      onPress={code ? () => p.onPaste(code) : undefined}
    />
  );
}

const styles = StyleSheet.create({
  continueButton: {
    marginTop: 18,
    maxWidth: 400,
    width: "100%",
  },
  codeBorder: {
    borderColor: myColors.divider3,
    borderWidth: 2,
    borderRadius: 6,
    height: 60,
    width: 50,
    marginLeft: 8,
  },
  codeInputContainer: {
    width: 55 * 6,
    marginTop: 10,
    marginLeft: 8,
  },
  codeInput: {
    width: 0,
    letterSpacing: device.web ? 46 : 46,
    marginLeft: -23,
    fontSize: 22,
  },
});
