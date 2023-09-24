import React, { useContext, useRef } from "react";
import { Button, Text, StyleSheet, Appearance } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ThemeModal from "../components/ThemeModal";
import { storeData, removeItem, getAllData } from "../config/asyncStorage";
import { colors } from "../config/theme";
import { ThemeContext } from "../context/ThemeContext";

const HomeScreen = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const themeColors = colors[theme];
  const modalRef = useRef(null);

  function handleThemeModal() {
    modalRef.current?.open(); // Abrir o #ThemeModal
  }

  function closeModal() {
    modalRef.current?.close(); // Fechar o #ThemeModal
  }

  function handleThemeSelection(selectedTheme) {
    updateTheme(
      selectedTheme === "auto" ? Appearance.getColorScheme() : selectedTheme,
    );
    storeData("themeAuto", selectedTheme === "auto" ? "true" : "false");
    closeModal();
  }

  // Estilos (têm de estar definidos aqui, pois a variável themeColors tem de ser acessível)
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      flex: 1,
      backgroundColor: themeColors.primary,
    },
    text: {
      textAlign: "center",
      color: themeColors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello</Text>
      <Button title="Change Theme" onPress={handleThemeModal} />

      <ThemeModal
        modalRef={modalRef}
        themeColors={themeColors}
        handleThemeSelection={handleThemeSelection}
      />

      <Button onPress={() => getAllData()} title="Get all data" />
      <Button onPress={() => removeItem("theme")} title="Remove item 'theme'" />
      <Button
        onPress={() => removeItem("themeAuto")}
        title="Remove item 'themeAuto'"
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
