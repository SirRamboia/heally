import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Appearance, Alert } from "react-native";

import { storeData, getData, removeItem } from "./src/config/asyncStorage";
import { ThemeContext } from "./src/context/ThemeContext";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createStackNavigator();

const App = () => {
  // Estado para armazenar o tema atual
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  // Função para atualizar o tema e armazená-lo no AsyncStorage
  const updateTheme = async (newTheme) => {
    const updatedTheme = newTheme === "light" ? "light" : "dark";
    setTheme(updatedTheme);
    await storeData("theme", updatedTheme);
  };

  // Função para procurar o tema armazenado no AsyncStorage ao iniciar o aplicativo
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
    }
  };

  const customFonts = {
    // Inter
    "Inter-Black": require("./src/assets/fonts/Inter/Inter-Black.ttf"),
    "Inter-Bold": require("./src/assets/fonts/Inter/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("./src/assets/fonts/Inter/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight": require("./src/assets/fonts/Inter/Inter-ExtraLight.ttf"),
    "Inter-Light": require("./src/assets/fonts/Inter/Inter-Light.ttf"),
    "Inter-Medium": require("./src/assets/fonts/Inter/Inter-Medium.ttf"),
    "Inter-Regular": require("./src/assets/fonts/Inter/Inter-Regular.ttf"),
    "Inter-SemiBold": require("./src/assets/fonts/Inter/Inter-SemiBold.ttf"),
    "Inter-Thin": require("./src/assets/fonts/Inter/Inter-Thin.ttf"),
    // Rubik
    "Rubik-Medium": require("./src/assets/fonts/Rubik/Rubik-Medium.ttf"),
  };

  function cacheFonts(fonts) {
    return fonts.map((font) => Font.loadAsync(font));
  }

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Prevenir que o SplashScreen seja ocultado automaticamente
        SplashScreen.preventAutoHideAsync();

        /* 
          function cacheImages(images) {
            return images.map(image => {
              if (typeof image ==== 'string') {
                return Image.prefetch(image);
              } else {
                return Asset.fromModule(image).downloadAsync();
              }
            });
          }

          cacheImages: https://docs.expo.dev/archive/classic-updates/preloading-and-caching-assets/#pre-loading-and-caching-assets

          const imageAssets = cacheImages([
            'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
            require('./assets/images/circle.jpg'),
          ]);

          Promise.all([...imageAssets])
        */

        // Procurar e definir o tema ao iniciar o aplicativo
        fetchStoredTheme();
        const fontAssets = cacheFonts([Ionicons.font, customFonts]);

        await Promise.all([...fontAssets]);
      } catch (e) {
        console.warn(e);
      } finally {
        SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();

    // // Adicionar um listener para alterações no tema do dispositivo
    Appearance.addChangeListener(async ({ colorScheme }) => {
      const autoThemeEnabled = await getData("themeAuto");
      console.log("Alterou o tema do dispositivo para: ", colorScheme);
      if (autoThemeEnabled === "true" || !autoThemeEnabled) {
        // Atualizar o tema se a opção de tema automático estiver ativada ou não estiver definida (ao nunca ter definido um tema)
        updateTheme(colorScheme);
      }
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
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
