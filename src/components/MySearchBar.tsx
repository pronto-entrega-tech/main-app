import React, { useState } from "react";
import { View, StyleProp, TextInput, ViewStyle } from "react-native";
import IconButton from "./IconButton";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import myFonts from "~/constants/myFonts";

const MySearchBar = ({
  style,
  defaultValue = "",
  onSubmit,
}: {
  style?: StyleProp<ViewStyle>;
  defaultValue?: string;
  onSubmit: (query: string) => void;
}) => {
  const [query, setSearchQuery] = useState(defaultValue);

  const submit = () => {
    if (query) onSubmit(query);
  };

  return (
    <View
      style={[
        {
          flexGrow: 1,
          flexDirection: "row",
          borderRadius: 50,
          borderWidth: 2,
          borderColor: myColors.primaryColor,
          height: 38,
          backgroundColor: "white",
        },
        globalStyles.elevation3,
        style,
      ]}
    >
      <IconButton
        icon="magnify"
        color="rgba(0, 0, 0, 0.54)"
        style={{
          width: 48,
          height: 48,
          alignSelf: "center",
        }}
        disabledStyle={{}}
        disabled={!query}
        onPress={submit}
      />
      <TextInput
        style={{
          flex: 1,
          paddingLeft: 8,
          fontSize: 18,
          fontFamily: myFonts.Regular,
        }}
        placeholder="O que você procura?"
        role="searchbox"
        enterKeyHint="search"
        value={query}
        onChangeText={setSearchQuery}
        onSubmitEditing={submit}
      />
      {!!query && (
        <IconButton
          icon="close"
          color="rgba(0, 0, 0, 0.54)"
          style={{
            width: 48,
            height: 48,
            padding: 12,
            alignSelf: "center",
          }}
          onPress={() => setSearchQuery("")}
        />
      )}
    </View>
  );
};

export default MySearchBar;
