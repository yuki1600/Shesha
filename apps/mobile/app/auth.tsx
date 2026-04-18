import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { readIsLoggedIn, writeIsLoggedIn } from '@/lib/auth';
import { theme } from '@/constants/theme';

type AuthMode = 'login' | 'signup';

const shellCanvas = theme.colors.stoneCanvas;
const shellCard = theme.colors.stoneCard;
const shellSurface = theme.colors.stoneSurface;
const shellBorder = theme.colors.stoneBorder;
const shellBorderStrong = theme.colors.stoneBorderStrong;
const shellAccent = theme.colors.sage;
const shellAccentStrong = theme.colors.sageDeep;
const shellAccentSoft = theme.colors.sageWash;
const shellWarmText = theme.colors.earth;
const googleColor = '#db4437';
const linkedInColor = '#0a66c2';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const resolveSession = async () => {
      const isLoggedIn = await readIsLoggedIn();

      if (!isMounted) return;

      if (isLoggedIn) {
        router.replace('/(tabs)/dharma');
        return;
      }

      setSessionChecked(true);
    };

    void resolveSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const submit = async () => {
    if (mode === 'signup') {
      router.push('/onboarding');
      return;
    }

    await writeIsLoggedIn(true);
    router.replace('/(tabs)/dharma');
  };

  const content = (
    <View style={styles.container}>
      <View style={styles.brandBlock}>
        <Image
          source={require('../assets/images/sesha-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Śeṣa</Text>
        <Text style={styles.subtitle}>Srimate Ramanujaya Namaha</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.modeBar}>
          <ModeChip active={mode === 'login'} label="Login" onPress={() => setMode('login')} />
          <ModeChip active={mode === 'signup'} label="Sign up" onPress={() => setMode('signup')} />
        </View>

        <View style={styles.cardCopy}>
          <Text style={styles.cardTitle}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {mode === 'login'
              ? 'Sign in on this device and continue into the app.'
              : 'Continue with email for now. The onboarding flow will come next.'}
          </Text>
        </View>

        <AuthField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <AuthField
          label="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />

        <Pressable style={styles.primaryButton} onPress={submit}>
          <Text style={styles.primaryButtonText}>
            {mode === 'login' ? 'Login with Email' : 'Sign up with Email'}
          </Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.providerButton} onPress={submit}>
          <FontAwesome name="google" size={18} color={googleColor} />
          <Text style={styles.providerButtonText}>
            {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
          </Text>
        </Pressable>

        <Pressable style={styles.providerButton} onPress={submit}>
          <FontAwesome name="linkedin-square" size={18} color={linkedInColor} />
          <Text style={styles.providerButtonText}>
            {mode === 'login' ? 'Continue with LinkedIn' : 'Sign up with LinkedIn'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  if (!sessionChecked) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={shellAccent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ModeChip({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.modeChip,
        active && styles.modeChipActive,
        pressed && !active && styles.modeChipPressed,
      ]}
      onPress={onPress}>
      <Text style={[styles.modeChipText, active ? styles.modeChipTextActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function AuthField({
  label,
  value,
  onChangeText,
  autoCapitalize = 'sentences',
  keyboardType,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={theme.colors.tabInactive}
      />
    </View>
  );
}

const serifTitle = Platform.select({
  android: 'serif',
  ios: 'Georgia',
  default: undefined,
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    gap: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 56,
  },
  brandBlock: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 8,
  },
  logo: {
    width: 156,
    height: 156,
    marginBottom: -34,
  },
  title: {
    color: theme.colors.text,
    fontFamily: serifTitle,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    marginTop: -12,
  },
  subtitle: {
    color: shellWarmText,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    gap: 14,
    padding: 20,
    borderRadius: 28,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  modeBar: {
    flexDirection: 'row',
    gap: 10,
    padding: 6,
    borderRadius: 18,
    backgroundColor: shellSurface,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  modeChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderRadius: 14,
  },
  modeChipActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  modeChipPressed: {
    backgroundColor: '#e5e7eb',
  },
  modeChipText: {
    color: theme.colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
  },
  modeChipTextActive: {
    color: shellAccentStrong,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  cardCopy: {
    minHeight: 76,
    gap: 6,
    justifyContent: 'center',
  },
  cardSubtitle: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: shellSurface,
    borderWidth: 1,
    borderColor: shellBorder,
    color: theme.colors.text,
    fontSize: 15,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: shellAccentStrong,
  },
  primaryButtonText: {
    color: theme.colors.buttonText,
    fontSize: 15,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: shellBorderStrong,
  },
  dividerText: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
  },
  providerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: shellBorder,
    backgroundColor: shellSurface,
  },
  providerButtonText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
