import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { serverError } from '~/components/Errors';
import Loading from '~/components/Loading';
import MyButton from '~/components/MyButton';
import MyInput from '~/components/MyInput';
import MyText from '~/components/MyText';
import { globalStyles, myColors } from '~/constants';
import { useAuthContext } from '~/contexts/AuthContext';
import { useAlertContext } from '~/contexts/AlertContext';
import { range } from '~/functions/range';
import useRouting from '~/hooks/useRouting';
import { api } from '~/services/api';

const EmailSignIn = () => {
  const { navigate } = useRouting();
  const { signIn } = useAuthContext();
  const { alert } = useAlertContext();
  const [isLoading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [input, setInput] = useState('');
  const [hasCodeError, setCodeError] = useState(false);
  const key = useRef('');
  const createToken = useRef('');

  const nextState = () => {
    setStage((s) => s + 1);
    setInput('');
    setLoading(false);
  };

  const auth = (accessToken: string, refreshToken?: string) => {
    signIn({ accessToken, refreshToken });
    navigate('Home');
  };

  const sendCode = async (text: string) => {
    setCodeError(false);
    if (text.length < 5) return;

    setLoading(true);

    try {
      const res = await api.auth.validate(key.current, text);
      createToken.current = res.token;

      res.type === 'ACCESS'
        ? auth(res.token, res.session?.refresh_token)
        : nextState();
    } catch {
      setInput('');
      setCodeError(true);
      setLoading(false);
    }
  };

  const codeInput = (
    <View style={{ marginLeft: 55 }}>
      <View style={{ position: 'absolute', flexDirection: 'row', left: -8 }}>
        {range(1, 5).map((n) => (
          <View key={n} style={styles.codeBorder} />
        ))}
      </View>
      <MyInput
        autoFocus
        maxLength={5}
        keyboardType='numeric'
        inputStyle={styles.codeInput}
        errorMessage={hasCodeError ? 'Código inválido' : ''}
        onChangeText={sendCode}
        containerStyle={styles.codeInputContainer}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        errorStyle={{ fontSize: 14, marginTop: 16 }}
      />
    </View>
  );

  const data = (
    [
      {
        title: 'Insira seu email',
        autoComplete: 'email',
        onPress: async () => {
          const res = await api.auth.email(input);
          key.current = res.key;

          nextState();
        },
      },
      {
        title: 'Insira o código de verificação',
        component: codeInput,
      },
      {
        title: 'Insira seu nome',
        autoComplete: 'name',
        onPress: async () => {
          const res = await api.customers.create(createToken.current, input);

          auth(res.access_token, res.refresh_token);
        },
      },
    ] as const
  )[stage];

  if (isLoading) return <Loading />;

  const next = () => {
    setLoading(true);

    if (data.component) return;
    data.onPress().catch(() => {
      setLoading(false);
      serverError(alert);
    });
  };

  return (
    <View style={[globalStyles.centralizer, { paddingHorizontal: 24 }]}>
      <MyText style={{ fontSize: 18, marginBottom: 36 }}>{data.title}</MyText>
      {data.component ?? (
        <>
          <MyInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={next}
            autoFocus
            autoCapitalize='none'
            autoCorrect={false}
            autoComplete={data.autoComplete}
            containerStyle={{ maxWidth: 400 }}
          />
          <MyButton
            buttonStyle={styles.continueButton}
            title='Continuar'
            disabled={!input}
            onPress={next}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  continueButton: {
    marginTop: 18,
    maxWidth: 400,
    width: '100%',
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
    letterSpacing: 46,
    fontSize: 22,
  },
});

export default EmailSignIn;
