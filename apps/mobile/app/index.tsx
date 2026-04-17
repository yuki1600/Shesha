import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { readIsLoggedIn } from '@/lib/auth';

const shellCanvas = theme.colors.stoneCanvas;
const shellAccent = theme.colors.sage;

export default function LaunchScreen() {
  useEffect(() => {
    let isMounted = true;

    const resolveRoute = async () => {
      const isLoggedIn = await readIsLoggedIn();

      if (!isMounted) return;

      router.replace(isLoggedIn ? '/(tabs)/dharma' : '/auth');
    };

    void resolveRoute();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ActivityIndicator size="small" color={shellAccent} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: shellCanvas,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
