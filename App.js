import React, { useState, useEffect } from "react";
import { Appearance, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Prevenir que o SplashScreen seja ocultado automaticamente
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

import HomeScreen from "./src/screens/HomeScreen";
import { ThemeContext } from "./src/context/ThemeContext";
import {
  storeData,
  getData,
  removeItem
} from "./src/config/asyncStorage";

const Stack = createStackNavigator();

const App = () => {
  // Estado para armazenar o tema atual
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  // Função para atualizar o tema e armazená-lo no AsyncStorage
  const updateTheme = async newTheme => {
    const updatedTheme = newTheme === "light" ? "light" : "dark";
    setTheme(updatedTheme);
    await storeData("theme", updatedTheme);
  };

  // Função para buscar o tema armazenado no AsyncStorage ao iniciar o aplicativo
  const fetchStoredTheme = async () => {
    try {
      const themeData = await getData("theme");
      if (themeData) {
        setTheme(themeData);
      } else {
        setTheme(Appearance.getColorScheme());
      }
    } catch (error) {
      // Tratamento de erro ao buscar o tema
      Alert.alert("An error occurred while loading the theme", error.message);
      await removeItem("theme");
    } finally {
      // Esconder o SplashScreen após 0.5 segundos
      setTimeout(() => SplashScreen.hideAsync(), 500);
    }
  };

   useEffect(() => {
    // Procurar e definir o tema ao iniciar o aplicativo
    fetchStoredTheme();

    // // Adicionar um listener para alterações no tema do dispositivo
    Appearance.addChangeListener(async ({ colorScheme }) => {
      let autoThemeEnabled = await getData('themeAuto');
      console.log("Alterou o tema do dispositivo para: ", colorScheme)
      if (autoThemeEnabled === 'true' || !autoThemeEnabled) {
        // Atualizar o tema se a opção de tema automático estiver ativada ou não estiver definida (ao nunca ter definido um tema)
        updateTheme(colorScheme);
      }
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <StatusBar style={theme == "dark" ? "light" : "dark"} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home"
            component={HomeScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};

export default App;
