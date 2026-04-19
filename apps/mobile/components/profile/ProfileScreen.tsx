import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { type ReactNode, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { writeIsLoggedIn } from '@/lib/auth';

type Provider = 'google' | 'linkedin';
type ProfileSection = 'personal' | 'community' | 'career' | 'privacy';

type ProviderState = {
  connected: boolean;
  primaryLabel: string;
};

type ProfileState = {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  city: string;
  stateRegion: string;
  country: string;
  bio: string;
  dob: string;
  age: string;
  languages: string[];
  roleTags: string[];
  occupation: string;
  organization: string;
  education: string;
  yearsExperience: string;
  website: string;
  linkedinUrl: string;
  templeAffiliation: string;
  lineagePreference: string;
  guardianMode: string;
  gotra: string;
  acharyaName: string;
  samashrayanamStatus: string;
  templeParticipation: string;
  contactVisibility: boolean;
  kamaVisible: boolean;
  showLocation: boolean;
  notificationsEnabled: boolean;
  profileImageUri?: string;
};

const languageOptions = ['English', 'Tamil', 'Sanskrit'];
const roleOptions = ['Community Member', 'Seeker', 'Recruiter', 'Guardian'];
const gotraOptions = ['Bharadwaja', 'Kashyapa', 'Vasishta', 'Kaundinya'];
const acharyaOptions = ['Ahobila Mutt', 'Andavan Ashramam', 'Vanamamalai Mutt', 'Home tradition'];
const samashrayanamOptions = ['Completed', 'Planned', 'Learning', 'Prefer not to say'];
const participationOptions = ['Daily temple', 'Weekly temple', 'Festival-focused', 'Home practice'];
const shellCanvas = theme.colors.stoneCanvas;
const shellCard = theme.colors.stoneCard;
const shellSurface = theme.colors.stoneSurface;
const shellBorder = theme.colors.stoneBorder;
const shellAccent = theme.colors.sage;
const shellAccentStrong = theme.colors.sageDeep;
const shellAccentSoft = theme.colors.sageWash;
const shellWarmText = theme.colors.earth;

const initialProfile: ProfileState = {
  fullName: 'Ramanuja Dasan',
  displayName: 'Ramanuja Dasan',
  email: 'ramanujadasan@example.com',
  phone: '+91 98765 43210',
  city: 'Chennai',
  stateRegion: 'Tamil Nadu',
  country: 'India',
  bio: 'Building a calm digital home for community, opportunity, and respectful introductions.',
  dob: '1993-08-12',
  age: '32',
  languages: ['English', 'Tamil'],
  roleTags: ['Community Member', 'Recruiter'],
  occupation: 'Product Builder',
  organization: 'Śeṣa',
  education: 'B.Tech, Computer Science',
  yearsExperience: '9',
  website: 'https://sesha.app',
  linkedinUrl: 'https://www.linkedin.com/in/ramanujadasan',
  templeAffiliation: 'Parthasarathy Temple',
  lineagePreference: 'Ramanuja Sampradaya',
  guardianMode: 'Optional',
  gotra: 'Bharadwaja',
  acharyaName: 'Ahobila Mutt',
  samashrayanamStatus: 'Completed',
  templeParticipation: 'Weekly temple',
  contactVisibility: false,
  kamaVisible: true,
  showLocation: true,
  notificationsEnabled: true,
};

const initialProviders: Record<Provider, ProviderState> = {
  google: {
    connected: true,
    primaryLabel: 'ramanujadasan@example.com',
  },
  linkedin: {
    connected: false,
    primaryLabel: 'Not connected',
  },
};

const profileSections: Array<{
  key: ProfileSection;
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
}> = [
  { key: 'personal', label: 'Personal', icon: 'user-circle-o' },
  { key: 'community', label: 'Community', icon: 'hand-paper-o' },
  { key: 'career', label: 'Career', icon: 'briefcase' },
  { key: 'privacy', label: 'Privacy', icon: 'lock' },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState(initialProfile);
  const [providers, setProviders] = useState(initialProviders);
  const [activeSection, setActiveSection] = useState<ProfileSection>('personal');
  const [savedStamp, setSavedStamp] = useState('Saved 2 minutes ago');

  const updateProfile = <K extends keyof ProfileState>(key: K, value: ProfileState[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const toggleMultiSelect = (key: 'languages' | 'roleTags', value: string) => {
    setProfile((current) => {
      const existing = current[key];
      const next = existing.includes(value)
        ? existing.filter((item) => item !== value)
        : [...existing, value];

      return { ...current, [key]: next };
    });
  };

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Allow photo library access to update your profile picture.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      updateProfile('profileImageUri', result.assets[0]?.uri);
      setSavedStamp('Photo updated locally');
    }
  };

  const handleProviderAction = (provider: Provider) => {
    setProviders((current) => ({
      ...current,
      [provider]: current[provider].connected
        ? { connected: false, primaryLabel: 'Not connected' }
        : {
            connected: true,
            primaryLabel:
              provider === 'google'
                ? profile.email || 'ramanujadasan@gmail.com'
                : profile.linkedinUrl || 'linkedin.com/in/yourprofile',
          },
    }));

    setSavedStamp(
      provider === 'google'
        ? 'Google connection updated'
        : 'LinkedIn connection updated',
    );
  };

  const handleSave = () => {
    setSavedStamp('Saved just now');
    Alert.alert(
      'Profile saved',
      'Your profile changes are stored in this prototype. Backend profile sync comes next.',
    );
  };

  const handleLogout = async () => {
    await writeIsLoggedIn(false);
    router.replace('/auth');
  };

  const activeContent = useMemo(() => {
    switch (activeSection) {
      case 'personal':
        return (
          <>
            <SectionHeader
              title="Personal information"
              subtitle="Core identity details used across the app."
            />
            <InputRow>
              <Field
                label="Full name"
                value={profile.fullName}
                onChangeText={(value) => updateProfile('fullName', value)}
              />
              <Field
                label="Display name"
                value={profile.displayName}
                onChangeText={(value) => updateProfile('displayName', value)}
              />
            </InputRow>
            <InputRow>
              <Field
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={profile.email}
                onChangeText={(value) => updateProfile('email', value)}
              />
              <Field
                label="Phone"
                keyboardType="phone-pad"
                value={profile.phone}
                onChangeText={(value) => updateProfile('phone', value)}
              />
            </InputRow>
            <InputRow>
              <Field
                label="Date of birth"
                value={profile.dob}
                onChangeText={(value) => updateProfile('dob', value)}
              />
              <Field
                label="Age"
                keyboardType="number-pad"
                value={profile.age}
                onChangeText={(value) => updateProfile('age', value)}
              />
            </InputRow>
            <InputRow>
              <Field
                label="City"
                value={profile.city}
                onChangeText={(value) => updateProfile('city', value)}
              />
              <Field
                label="State"
                value={profile.stateRegion}
                onChangeText={(value) => updateProfile('stateRegion', value)}
              />
            </InputRow>
            <Field
              label="Country"
              value={profile.country}
              onChangeText={(value) => updateProfile('country', value)}
            />
            <View style={styles.compactCard}>
              <View style={styles.compactHeader}>
                <Text style={styles.compactTitle}>Connected accounts</Text>
                <Text style={styles.compactSubtitle}>
                  Manage login and profile sync connections here.
                </Text>
              </View>
              <View style={styles.compactProviders}>
                <CompactProvider
                  icon="google"
                  title="Google"
                  accentColor={shellAccentStrong}
                  state={providers.google}
                  onPress={() => handleProviderAction('google')}
                />
                <CompactProvider
                  icon="linkedin-square"
                  title="LinkedIn"
                  accentColor={shellWarmText}
                  state={providers.linkedin}
                  onPress={() => handleProviderAction('linkedin')}
                />
              </View>
            </View>
          </>
        );
      case 'community':
        return (
          <>
            <SectionHeader
              title="Community identity"
              subtitle="How you show up within Śeṣa and the wider community."
            />
            <Field
              label="Bio"
              value={profile.bio}
              onChangeText={(value) => updateProfile('bio', value)}
              multiline
            />
            <ChipGroup
              label="Languages"
              options={languageOptions}
              selected={profile.languages}
              onToggle={(value) => toggleMultiSelect('languages', value)}
            />
            <ChipGroup
              label="Role tags"
              options={roleOptions}
              selected={profile.roleTags}
              onToggle={(value) => toggleMultiSelect('roleTags', value)}
            />
            <SingleSelectGroup
              label="Gotra"
              options={gotraOptions}
              selected={profile.gotra}
              onSelect={(value) => updateProfile('gotra', value)}
            />
            <SingleSelectGroup
              label="Acharya name"
              options={acharyaOptions}
              selected={profile.acharyaName}
              onSelect={(value) => updateProfile('acharyaName', value)}
            />
            <SingleSelectGroup
              label="Samashrayanam status"
              options={samashrayanamOptions}
              selected={profile.samashrayanamStatus}
              onSelect={(value) => updateProfile('samashrayanamStatus', value)}
            />
            <SingleSelectGroup
              label="Temple participation"
              options={participationOptions}
              selected={profile.templeParticipation}
              onSelect={(value) => updateProfile('templeParticipation', value)}
            />
            <InputRow>
              <Field
                label="Temple affiliation"
                value={profile.templeAffiliation}
                onChangeText={(value) => updateProfile('templeAffiliation', value)}
              />
              <Field
                label="Lineage preference"
                value={profile.lineagePreference}
                onChangeText={(value) => updateProfile('lineagePreference', value)}
              />
            </InputRow>
            <Field
              label="Guardian mode"
              value={profile.guardianMode}
              onChangeText={(value) => updateProfile('guardianMode', value)}
            />
          </>
        );
      case 'career':
        return (
          <>
            <SectionHeader
              title="Career and professional details"
              subtitle="The profile layer used for Artha and professional credibility."
            />
            <InputRow>
              <Field
                label="Occupation"
                value={profile.occupation}
                onChangeText={(value) => updateProfile('occupation', value)}
              />
              <Field
                label="Organization"
                value={profile.organization}
                onChangeText={(value) => updateProfile('organization', value)}
              />
            </InputRow>
            <InputRow>
              <Field
                label="Education"
                value={profile.education}
                onChangeText={(value) => updateProfile('education', value)}
              />
              <Field
                label="Years of experience"
                keyboardType="number-pad"
                value={profile.yearsExperience}
                onChangeText={(value) => updateProfile('yearsExperience', value)}
              />
            </InputRow>
            <InputRow>
              <Field
                label="Website"
                autoCapitalize="none"
                value={profile.website}
                onChangeText={(value) => updateProfile('website', value)}
              />
              <Field
                label="LinkedIn URL"
                autoCapitalize="none"
                value={profile.linkedinUrl}
                onChangeText={(value) => updateProfile('linkedinUrl', value)}
              />
            </InputRow>
          </>
        );
      case 'privacy':
        return (
          <>
            <SectionHeader
              title="Privacy and visibility"
              subtitle="Control exactly what appears and where."
            />
            <ToggleRow
              title="Hide contact details"
              description="Phone and email stay hidden until you explicitly approve sharing."
              value={!profile.contactVisibility}
              onValueChange={(value) => updateProfile('contactVisibility', !value)}
            />
            <ToggleRow
              title="Visible in Kama"
              description="Pause matchmaking visibility without affecting the rest of your account."
              value={profile.kamaVisible}
              onValueChange={(value) => updateProfile('kamaVisible', value)}
            />
            <ToggleRow
              title="Show location on profile"
              description="Expose city and state on public-facing profile views."
              value={profile.showLocation}
              onValueChange={(value) => updateProfile('showLocation', value)}
            />
            <ToggleRow
              title="Push notifications"
              description="Enable updates for intros, matches, jobs, comments, and announcements."
              value={profile.notificationsEnabled}
              onValueChange={(value) => updateProfile('notificationsEnabled', value)}
            />
          </>
        );
    }
  }, [activeSection, profile]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Pressable style={styles.avatarWrap} onPress={handleChangePhoto}>
              <View style={styles.avatarImageShell}>
                {profile.profileImageUri ? (
                  <Image source={{ uri: profile.profileImageUri }} style={styles.avatarImage} />
                ) : (
                  <Image
                    source={require('../../assets/images/sesha-logo.png')}
                    style={styles.avatarLogo}
                    resizeMode="contain"
                  />
                )}
              </View>
              <View style={styles.avatarEditBadge}>
                <FontAwesome name="camera" size={12} color="#ffffff" />
              </View>
            </Pressable>

            <View style={styles.heroIdentity}>
              <Text style={styles.heroName}>{profile.displayName || 'Ramanuja Dasan'}</Text>
              <Text style={styles.heroMeta}>
                {profile.city}, {profile.stateRegion}
              </Text>
              <Text style={styles.heroMeta}>
                {profile.occupation} at {profile.organization}
              </Text>
              <Text style={styles.savedText}>{savedStamp}</Text>
            </View>
          </View>

          <View style={styles.heroActions}>
            <Pressable style={styles.primaryButton} onPress={handleSave}>
              <FontAwesome name="save" size={16} color={theme.colors.buttonText} />
              <Text style={styles.primaryButtonText}>Save profile</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={handleLogout}>
              <FontAwesome name="sign-out" size={16} color={shellAccent} />
              <Text style={styles.secondaryButtonText}>Logout</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionTabs}>
          {profileSections.map((section) => {
            const active = section.key === activeSection;

            return (
              <Pressable
                key={section.key}
                style={[styles.sectionTab, active ? styles.sectionTabActive : null]}
                onPress={() => setActiveSection(section.key)}>
                <FontAwesome
                  name={section.icon}
                  size={18}
                  color={active ? '#ffffff' : shellAccent}
                />
                <Text
                  style={[
                    styles.sectionTabText,
                    active ? styles.sectionTabTextActive : null,
                  ]}>
                  {section.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>{activeContent}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function InputRow({ children }: { children: ReactNode }) {
  return <View style={styles.inputRow}>{children}</View>;
}

function Field({
  label,
  value,
  onChangeText,
  multiline = false,
  keyboardType,
  autoCapitalize = 'sentences',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline ? styles.multilineInput : null]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={theme.colors.tabInactive}
      />
    </View>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <Pressable
              key={option}
              style={[styles.chip, active ? styles.chipActive : null]}
              onPress={() => onToggle(option)}>
              <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SingleSelectGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {options.map((option) => {
          const active = selected === option;
          return (
            <Pressable
              key={option}
              style={[styles.chip, active ? styles.chipActive : null]}
              onPress={() => onSelect(option)}>
              <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor="#ffffff"
        trackColor={{ false: shellBorder, true: shellAccent }}
      />
    </View>
  );
}

function CompactProvider({
  icon,
  title,
  accentColor,
  state,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  accentColor: string;
  state: ProviderState;
  onPress: () => void;
}) {
  return (
    <View style={styles.compactProvider}>
      <View style={styles.compactProviderTop}>
        <View style={[styles.compactIconWrap, { backgroundColor: `${accentColor}15` }]}>
          <FontAwesome name={icon} size={18} color={accentColor} />
        </View>
        <View style={styles.compactProviderCopy}>
          <Text style={styles.compactProviderTitle}>{title}</Text>
          <Text style={styles.compactProviderState}>{state.primaryLabel}</Text>
        </View>
      </View>
      <Pressable
        style={[styles.compactButton, state.connected ? styles.compactButtonMuted : null]}
        onPress={onPress}>
        <Text style={styles.compactButtonText}>
          {state.connected ? 'Disconnect' : 'Connect'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: shellCanvas,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 28,
    gap: 16,
  },
  heroCard: {
    gap: 18,
    padding: 20,
    borderRadius: 28,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrap: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  avatarImageShell: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
    overflow: 'hidden',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: shellAccentStrong,
    borderWidth: 2,
    borderColor: shellCard,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarLogo: {
    width: 78,
    height: 78,
  },
  heroIdentity: {
    flex: 1,
    gap: 5,
  },
  heroName: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    flex: 1,
  },
  heroMeta: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  savedText: {
    marginTop: 4,
    color: shellWarmText,
    fontSize: 12,
    fontWeight: '700',
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 16,
    backgroundColor: shellAccentStrong,
  },
  primaryButtonText: {
    color: theme.colors.buttonText,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: shellBorder,
    backgroundColor: shellSurface,
  },
  secondaryButtonText: {
    color: shellAccent,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionTab: {
    flex: 1,
    minWidth: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: shellSurface,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  sectionTabActive: {
    backgroundColor: shellAccentStrong,
    borderColor: shellAccentStrong,
  },
  sectionTabText: {
    color: shellAccent,
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTabTextActive: {
    color: '#ffffff',
  },
  card: {
    gap: 16,
    padding: 18,
    borderRadius: 24,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  compactCard: {
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: shellSurface,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  compactHeader: {
    gap: 2,
  },
  compactTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  compactSubtitle: {
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },
  compactProviders: {
    gap: 10,
  },
  compactProvider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  compactProviderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  compactIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactProviderCopy: {
    flex: 1,
    gap: 2,
  },
  compactProviderTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  compactProviderState: {
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
  },
  compactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 92,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: shellAccentStrong,
  },
  compactButtonMuted: {
    backgroundColor: shellWarmText,
  },
  compactButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  inputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fieldWrap: {
    flex: 1,
    minWidth: 150,
    gap: 8,
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: shellSurface,
    color: theme.colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  multilineInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: shellSurface,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  chipActive: {
    backgroundColor: shellAccentSoft,
    borderColor: shellAccent,
  },
  chipText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: shellAccentStrong,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 6,
  },
  toggleCopy: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  toggleDescription: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
  },
});
