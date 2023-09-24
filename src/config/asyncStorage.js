import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const storeData = async (key, value) => {
  if (key && value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch ({ message }) {
      Alert.alert("An error occurred while saving data on the device", message);
    }
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? value : null;
  } catch ({ message }) {
    Alert.alert(
      "An error occurred when retrieving data from the device",
      message,
    );
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`@${key} deleted from local AsyncStorage!`);
  } catch (error) {
    console.log(error);
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All local AsyncStorage deleted!");
  } catch (error) {
    console.log(error);
  }
};

export const getAllData = async () => {
  try {
    AsyncStorage.getAllKeys().then((keys) =>
      AsyncStorage.multiGet(keys).then((data) => console.log(data)),
    );
  } catch (error) {
    console.error(error);
  }
};
