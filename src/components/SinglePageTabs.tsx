import React, { ReactNode, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import globalStyles from "~/constants/globalStyles";
import myColors from "~/constants/myColors";
import MyTouchable from "./MyTouchable";
import MyText from "./MyText";
import MyDivider from "./MyDivider";

export type SinglePageTab = {
  title: string;
  element: ReactNode;
};
export const SinglePageTabs = ({
  header,
  tabs,
}: {
  header: ReactNode;
  tabs: SinglePageTab[];
}) => {
  const [selected, setSelected] = useState(0);
  const pages = useRef(new Map([[0, tabs[0].element]]));

  return (
    <>
      <View
        style={[
          globalStyles.elevation3,
          {
            position: "sticky" as any,
            top: 0,
            zIndex: 1,
            width: "100%",
          },
        ]}
      >
        {header}
        <View
          style={[
            globalStyles.elevation3,
            {
              position: "sticky" as any,
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
              height: 48,
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
            },
          ]}
        >
          {tabs.map(({ title, element }, i) => {
            const isSelected = i === selected;
            return (
              <MyTouchable
                key={title}
                style={{
                  flex: 1,
                  height: "100%",
                  alignItems: "center",
                }}
                disabled={isSelected}
                onPress={() => {
                  pages.current.set(i, element);
                  setSelected(i);
                }}
              >
                <View style={globalStyles.centralizer}>
                  <MyText
                    style={{
                      fontSize: 13,
                      letterSpacing: 0.5,
                      color: "rgb(80, 80, 80)",
                      opacity: isSelected ? 1 : 0.5,
                    }}
                  >
                    {title.toUpperCase()}
                  </MyText>
                </View>
                <MyDivider
                  style={{
                    height: 2,
                    backgroundColor: isSelected
                      ? myColors.primaryColor
                      : "transparent",
                  }}
                />
              </MyTouchable>
            );
          })}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {[...pages.current].map(([i, page]) => {
          const isSelected = i === selected;
          return (
            <View
              key={i}
              style={[
                StyleSheet.absoluteFill,
                !isSelected && { display: "none" },
              ]}
            >
              {page}
            </View>
          );
        })}
      </View>
    </>
  );
};
