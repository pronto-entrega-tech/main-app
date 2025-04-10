import React, { useEffect, createRef, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { getDocumentAsync, DocumentPickerAsset } from "expo-document-picker";
import Loading from "~/components/Loading";
import { useAlertContext } from "~/contexts/AlertContext";
import { useToastContext } from "~/contexts/ToastContext";
import IconButton from "~/components/IconButton";
import MyButton from "~/components/MyButton";
import MyDivider from "~/components/MyDivider";
import MyIcon from "~/components/MyIcon";
import MyHeader from "~/components/MyHeader";
import useRouting from "~/hooks/useRouting";
import { reduceErrors } from "~/functions/reduceErrors";
import MyText from "~/components/MyText";
import { useAuthContext } from "~/contexts/AuthContext";
import FormContainer from "~/components/FormContainer";
import MyInput from "~/components/MyInput";
import { api } from "~/services/api";
import device from "~/constants/device";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

const emailRegex =
  /[a-zA-Z0-9.!#$%&'*+/=?`{|}~^-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
/* const emailCompleteReg = /^(.+)@(.+)\.(.{2,})$/; */

const UploadQuestion = () => (
  <>
    <MyHeader title="Envie sua dúvida" />
    <UploadQuestionBody />
  </>
);

const UploadQuestionBody = () => {
  const routing = useRouting();
  const { alert } = useAlertContext();
  const { toast } = useToastContext();
  const { isAuth, accessToken } = useAuthContext();
  const [email, setEmail] = useState<string>();
  const [emailError, setEmailError] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [documents, setDocuments] = useState<DocumentPickerAsset[]>([]);

  const inputTitle = createRef<TextInput>();
  const inputMessage = createRef<TextInput>();

  useEffect(() => {
    if (isAuth === false) return setEmail("");

    if (accessToken)
      api.customers.find(accessToken).then(({ email }) => {
        setEmail(email ?? "");
      });
  }, [isAuth, accessToken]);

  if (email === undefined) return <Loading />;

  const send = () => {
    const hasError = reduceErrors([
      [!emailRegex.test(email), setEmailError],
      [!title, setTitleError],
      [!message, setMessageError],
    ]);
    if (hasError) return;

    toast("Dúvida enviada");
    routing.navigate("Profile");
  };

  const addFile = async () => {
    if (documents.length > 4) return alert("Máximo de 5 anexos");

    const document = await getDocumentAsync({ copyToCacheDirectory: false });

    if (document.canceled) return;

    setDocuments([...documents, ...document.assets]);
  };

  return (
    <>
      <FormContainer>
        <MyInput
          label="Email"
          labelStyle={styles.label}
          errorMessage={emailError ? "Email inválido" : ""}
          defaultValue={email}
          placeholder="nome@email.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={styles.border}
          inputContainerStyle={{ borderColor: "transparent" }}
          onChangeText={(v) => {
            setEmailError(false);
            setEmail(v);
          }}
          enterKeyHint="next"
          onSubmitEditing={() => inputTitle.current?.focus()}
        />
        <MyInput
          _ref={inputTitle}
          label="Assunto"
          labelStyle={styles.label}
          errorMessage={titleError ? "Insira assunto" : ""}
          inputStyle={styles.border}
          inputContainerStyle={{ borderColor: "transparent" }}
          onChangeText={(v) => {
            setTitleError(false);
            setTitle(v);
          }}
          enterKeyHint="next"
          onSubmitEditing={() => inputMessage.current?.focus()}
        />
        <MyInput
          _ref={inputMessage}
          label="Descrição"
          labelStyle={styles.label}
          errorMessage={messageError ? "Insira descrição" : ""}
          inputStyle={styles.border}
          inputContainerStyle={{ borderColor: "transparent" }}
          style={{ textAlignVertical: "top" }}
          multiline={true}
          numberOfLines={5}
          onChangeText={(v) => {
            setMessageError(false);
            setMessage(v);
          }}
        />

        <MyText
          style={[
            styles.label,
            {
              alignSelf: "flex-start",
              fontFamily: myFonts.Bold,
              marginLeft: 19,
              fontSize: 16,
            },
          ]}
        >
          Anexos
        </MyText>
        <View style={styles.attachment}>
          <MyButton
            title="Adicionar arquivo"
            type="clear"
            buttonStyle={{ borderRadius: 12, width: "100%" }}
            onPress={addFile}
          />
          {documents.map((doc, i) => {
            return (
              <View key={i}>
                <MyDivider
                  style={{
                    backgroundColor: myColors.divider2,
                    width: device.width - 48,
                    alignSelf: "center",
                  }}
                />
                <View style={{ justifyContent: "center" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: device.width - 20,
                    }}
                  >
                    <MyIcon
                      name="file"
                      size={24}
                      color={myColors.primaryColor}
                      style={{ padding: 12 }}
                    />
                    <MyText
                      style={{
                        color: myColors.text4,
                        maxWidth: device.width - 120,
                      }}
                    >
                      {doc.name}
                    </MyText>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      onPress={() =>
                        setDocuments(documents.filter((v) => v !== doc))
                      }
                      icon="close-circle"
                      style={{ width: 48, height: 48 }}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </FormContainer>
      <MyButton
        title="Enviar"
        type="outline"
        buttonStyle={globalStyles.bottomButton}
        onPress={send}
      />
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    color: myColors.primaryColor,
    marginBottom: 6,
    marginLeft: 8,
  },
  border: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 8,
    borderColor: myColors.primaryColor,
  },
  attachment: {
    borderWidth: 2,
    borderColor: myColors.primaryColor,
    borderRadius: 12,
    marginHorizontal: 10,
    borderStyle: "dashed",
  },
});

export default UploadQuestion;
