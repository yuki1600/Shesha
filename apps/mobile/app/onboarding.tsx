import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { writeIsLoggedIn } from '@/lib/auth';

const neutralSurface = '#f4f5f7';
const neutralBorder = '#e5e7eb';
const neutralAccent = '#5f79a6';

export default function OnboardingScreen() {
  const enterApp = async () => {
    await writeIsLoggedIn(true);
    router.replace('/(tabs)/moksha');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Onboarding placeholder</Text>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.body}>
            This is the entry point for the signup onboarding workflow. We can replace this screen
            with the real sequence next.
          </Text>

          <View style={styles.stepList}>
            <View style={styles.stepChip}>
              <Text style={styles.stepChipText}>1. Invite verification</Text>
            </View>
            <View style={styles.stepChip}>
              <Text style={styles.stepChipText}>2. Basic profile</Text>
            </View>
            <View style={styles.stepChip}>
              <Text style={styles.stepChipText}>3. Pillar preferences</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={enterApp}>
          <Text style={styles.primaryButtonText}>Continue into the prototype</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Back to auth</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingBottom: 52,
    gap: 14,
  },
  heroCard: {
    gap: 14,
    padding: 22,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: neutralBorder,
  },
  eyebrow: {
    color: neutralAccent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  body: {
    color: theme.colors.mutedText,
    fontSize: 15,
    lineHeight: 23,
  },
  stepList: {
    gap: 10,
  },
  stepChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: neutralSurface,
  },
  stepChipText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutralAccent,
  },
  primaryButtonText: {
    color: theme.colors.buttonText,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: neutralSurface,
    borderWidth: 1,
    borderColor: neutralBorder,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
