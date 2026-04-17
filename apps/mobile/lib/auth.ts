import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGGED_IN_KEY = 'sesha:isLoggedIn';

export async function readIsLoggedIn() {
  const value = await AsyncStorage.getItem(LOGGED_IN_KEY);
  return value === 'true';
}

export async function writeIsLoggedIn(value: boolean) {
  await AsyncStorage.setItem(LOGGED_IN_KEY, value ? 'true' : 'false');
}
