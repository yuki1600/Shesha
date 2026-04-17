import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { getKamaProfile, requestKamaIntro, type KamaProfile, toggleKamaSaved } from '@/lib/mockApi';

const shellCanvas = theme.colors.stoneCanvas;
const shellCard = theme.colors.stoneCard;
const shellSurface = theme.colors.stoneSurface;
const shellBorder = theme.colors.stoneBorder;
const shellAccentStrong = theme.colors.sageDeep;
const shellWarmText = theme.colors.earth;

function resolveId(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function KamaDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = resolveId(params.id);
  const [profile, setProfile] = useState<KamaProfile | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const load = async () => {
      const data = await getKamaProfile(id);
      if (isMounted) setProfile(data);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSave = async () => {
    if (!profile) return;
    const updated = await toggleKamaSaved(profile.id);
    setProfile(updated);
  };

  const handleIntro = async () => {
    if (!profile) return;
    const updated = await requestKamaIntro(profile.id);
    setProfile(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="chevron-left" size={16} color={theme.colors.text} />
          </Pressable>
          <Pressable style={styles.backButton} onPress={handleSave}>
            <FontAwesome
              name={profile?.saved ? 'bookmark' : 'bookmark-o'}
              size={16}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        {profile ? (
          <>
            <View style={styles.heroCard}>
              <View style={[styles.heroVisual, { backgroundColor: profile.tint }]}>
                <View style={[styles.initialBadge, { backgroundColor: profile.accent }]}>
                  <Text style={styles.initialBadgeText}>{profile.name.slice(0, 1)}</Text>
                </View>
                <View style={styles.highlightRow}>
                  {profile.highlights.map((item) => (
                    <View key={item} style={styles.highlightPill}>
                      <Text style={styles.highlightPillText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.heroCopy}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>
                    {profile.name}, {profile.age}
                  </Text>
                  <Text style={styles.locationText}>{profile.location}</Text>
                </View>
                <Text style={styles.profileTitle}>{profile.title}</Text>
                <Text style={styles.prompt}>{profile.prompt}</Text>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bodyText}>{profile.bio}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Family</Text>
              <Text style={styles.bodyText}>{profile.family}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Education and work</Text>
              <Text style={styles.bodyText}>{profile.education}</Text>
              <Text style={styles.bodyText}>{profile.profession}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Values</Text>
              <View style={styles.valueRow}>
                {profile.values.map((value) => (
                  <View key={value} style={styles.valueChip}>
                    <Text style={styles.valueChipText}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <Text style={styles.bodyText}>{profile.languages.join(', ')}</Text>
              <Text style={styles.sectionTitle}>Looking for</Text>
              <Text style={styles.bodyText}>{profile.lookingFor}</Text>
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.secondaryButton} onPress={handleSave}>
                <Text style={styles.secondaryButtonText}>
                  {profile.saved ? 'Saved' : 'Save profile'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.primaryButton, profile.introRequested ? styles.primaryButtonMuted : null]}
                onPress={handleIntro}>
                <Text style={styles.primaryButtonText}>
                  {profile.introRequested ? 'Intro requested' : 'Request intro'}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.bodyText}>Loading profile...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: shellCanvas,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 30,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  heroCard: {
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  heroVisual: {
    minHeight: 300,
    justifyContent: 'space-between',
    padding: 20,
  },
  initialBadge: {
    width: 112,
    height: 112,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  initialBadgeText: {
    color: '#ffffff',
    fontSize: 46,
    fontWeight: '800',
  },
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  highlightPill: {
    paddingHorizontal: 10,
    minHeight: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251, 250, 247, 0.9)',
  },
  highlightPillText: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  heroCopy: {
    gap: 10,
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  nameText: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    flex: 1,
  },
  locationText: {
    color: shellWarmText,
    fontSize: 13,
    fontWeight: '700',
  },
  profileTitle: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  prompt: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  sectionCard: {
    gap: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  bodyText: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  valueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  valueChip: {
    paddingHorizontal: 12,
    minHeight: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: shellSurface,
  },
  valueChipText: {
    color: shellAccentStrong,
    fontSize: 12,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: shellSurface,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: shellAccentStrong,
  },
  primaryButtonMuted: {
    backgroundColor: shellWarmText,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
