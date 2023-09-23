import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";

const ThemeModal = ({ modalRef, themeColors, handleThemeSelection }) => {
    // Opções de seleção de tema
    const themeOptions = [
    {
      key: 1,
      value: "dark",
      icon: "moon",
      title: "Dark Mode",
    },
    {
      key: 2,
      value: "light",
      icon: "sunny",
      title: "Light Mode",
    },
    {
      key: 3,
      value: "auto",
      icon: "contrast",
      title: "Auto Mode",
    },
  ];

  // Styles
  const styles = {
    content: {
      padding: 20,
    },
    subheading: {
      marginBottom: 2,
      fontSize: 19,
      fontWeight: "600",
      color: themeColors.subheading,
      paddingBottom: 10,
      textAlign: "center",
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      paddingVertical: 9,
    },
    themeOptionText: {
      marginLeft: 12,
      fontSize: 17.5,
      fontWeight: "300",
      color: themeColors.text,
    },
    separator: {
      borderBottomColor: themeColors.separator,
      borderBottomWidth: 0.5, // Adiciona uma borda inferior
      marginBottom: 5, // Espaço entre os itens do menu
    },
  };

  return (
    <Modalize
      closeOnOverlayTap={true}
      ref={modalRef}
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
      adjustToContentHeight
      withHandle={true}
      modalStyle={{
        backgroundColor: themeColors.secondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <View style={styles.content}>
        <Text style={styles.subheading}>SET THEME</Text>

        {themeOptions.map((option, index) => (
          <TouchableOpacity
            key={option.key}
            onPress={() => handleThemeSelection(option.value)}
            style={[
              styles.themeOption,
              index !== themeOptions.length - 1 && styles.separator,
            ]}
          >
            <Ionicons name={option.icon} size={24} color={themeColors.text} />
            <View>
              <Text style={styles.themeOptionText}>{option.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Modalize>
  );
};

export default ThemeModal;
