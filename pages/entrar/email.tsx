import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  AppState,
  ActivityIndicator,
  TextInput,
} from "react-native";
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
import { useAsyncAction } from "~/hooks/useAsyncAction";
import { MotiView } from "moti";

type Stage =
  | {
      type: "email";
    }
  | {
      type: "code";
      codeKey: string;
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
        .with({ type: "code" }, ({ codeKey }) => (
          <CodeStage setState={setState} codeKey={codeKey} />
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
      codeKey: res.key,
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

function CodeStage({
  setState,
  codeKey,
}: {
  setState: setState;
  codeKey: string;
}) {
  const { navigate } = useRouting();
  const { signIn } = useAuthContext();

  const [code, setCode] = useState("");
  const [hasCodeError, setCodeError] = useState(false);

  const [submit, loading] = useAsyncAction(async (code: string) => {
    setCode(code);
    setCodeError(false);
    if (code.length < 5) return;

    try {
      const res = await api.auth.validate(codeKey, code);

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
  });

  return (
    <View style={[globalStyles.centralizer, { paddingHorizontal: 24 }]}>
      <PageTitle title="Código de verificação" />

      <MyText style={{ fontSize: 18, marginBottom: 36 }}>
        Insira o código de verificação
      </MyText>

      <View style={{ alignItems: "center", gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          {range(0, 4).map((n) => (
            <View key={n} style={styles.codeBorder}>
              {!code[n] && (n === 0 || code[n - 1]) ? (
                <Cursor />
              ) : (
                <MyText style={{ fontSize: 22 }}>{code[n]}</MyText>
              )}
            </View>
          ))}

          <TextInput
            autoFocus
            maxLength={5}
            inputMode="numeric"
            value={code}
            onChangeText={submit}
            readOnly={loading}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0,
            }}
          />
        </View>
        {hasCodeError && (
          <MyText style={{ color: myColors.error }}>Código inválido</MyText>
        )}

        <View style={{ height: 24 }}>
          {loading && <ActivityIndicator color={myColors.loading} size={24} />}
        </View>
      </View>

      {device.android && <PasteCodeButton onPaste={submit} />}
    </View>
  );
}

function Cursor() {
  return (
    <MotiView
      from={{
        opacity: 1,
      }}
      animate={{
        opacity: 0.2,
      }}
      transition={{
        loop: true,
        type: "timing",
        duration: 1000,
      }}
      style={{
        backgroundColor: myColors.text,
        height: 22,
        width: 1,
      }}
    />
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
      <MyAsyncButton
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
    justifyContent: "center",
    alignItems: "center",
  },
});
