import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import {
  type KamaFilter,
  type KamaProfile,
  listKamaProfiles,
  requestKamaIntro,
  toggleKamaSaved,
} from '@/lib/mockApi';

const filters: KamaFilter[] = ['All', 'Family-ready', 'Nearby', 'Traditional', 'Professional'];
const shellCanvas = theme.colors.stoneCanvas;
const shellCard = theme.colors.stoneCard;
const shellSurface = theme.colors.stoneSurface;
const shellBorder = theme.colors.stoneBorder;
const shellAccent = theme.colors.sage;
const shellAccentStrong = theme.colors.sageDeep;
const shellAccentSoft = theme.colors.sageWash;
const shellWarmText = theme.colors.earth;

export default function KamaScreen() {
  const isFocused = useIsFocused();
  const [profiles, setProfiles] = useState<KamaProfile[]>([]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<KamaFilter>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFocused) return;

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const data = await listKamaProfiles();

      if (!isMounted) return;

      setProfiles(data);
      setIsLoading(false);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const filteredProfiles = profiles.filter((profile) => {
    const search = query.trim().toLowerCase();
    const searchMatches =
      !search ||
      `${profile.name} ${profile.location} ${profile.title} ${profile.values.join(' ')}`.toLowerCase().includes(search);

    if (!searchMatches) return false;

    switch (activeFilter) {
      case 'Family-ready':
        return profile.highlights.some((item) => item.toLowerCase().includes('family'));
      case 'Nearby':
        return ['chennai', 'coimbatore'].some((city) =>
          profile.location.toLowerCase().includes(city),
        );
      case 'Traditional':
        return profile.highlights.some(
          (item) => item.toLowerCase().includes('traditional') || item.toLowerCase().includes('temple'),
        );
      case 'Professional':
        return /lead|doctor|architect|teacher|product/i.test(profile.title);
      default:
        return true;
    }
  });

  const handleSave = async (id: string) => {
    const updated = await toggleKamaSaved(id);
    setProfiles((current) => current.map((profile) => (profile.id === id ? updated : profile)));
  };

  const handleIntro = async (id: string) => {
    const updated = await requestKamaIntro(id);
    setProfiles((current) => current.map((profile) => (profile.id === id ? updated : profile)));
  };

  const savedCount = profiles.filter((profile) => profile.saved).length;
  const requestedCount = profiles.filter((profile) => profile.introRequested).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrap}>
          <FontAwesome name="search" size={16} color={theme.colors.mutedText} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search profiles, cities, values"
            placeholderTextColor={theme.colors.tabInactive}
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.filterRow}
          showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => {
            const active = filter === activeFilter;

            return (
              <Pressable
                key={filter}
                style={[styles.filterChip, active ? styles.filterChipActive : null]}
                onPress={() => setActiveFilter(filter)}>
                <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Profiles</Text>
            <Text style={styles.summaryValue}>{String(filteredProfiles.length).padStart(2, '0')}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Saved</Text>
            <Text style={styles.summaryValue}>{String(savedCount).padStart(2, '0')}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Requested</Text>
            <Text style={styles.summaryValue}>{String(requestedCount).padStart(2, '0')}</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Loading profiles...</Text>
          </View>
        ) : filteredProfiles.length ? (
          filteredProfiles.map((profile) => (
            <View key={profile.id} style={styles.profileCard}>
              <Pressable
                style={styles.profileOpenButton}
                onPress={() => router.push(`/kama/${profile.id}`)}>
                <View style={[styles.visualArea, { backgroundColor: profile.tint }]}>
                  <View style={[styles.initialBadge, { backgroundColor: profile.accent }]}>
                    <Text style={styles.initialBadgeText}>{profile.name.slice(0, 1)}</Text>
                  </View>
                  <View style={styles.visualMeta}>
                    {profile.highlights.slice(0, 2).map((item) => (
                      <View key={item} style={styles.visualPill}>
                        <Text style={styles.visualPillText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.profileCopy}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText}>
                      {profile.name}, {profile.age}
                    </Text>
                    <Text style={styles.locationText}>{profile.location}</Text>
                  </View>
                  <Text style={styles.profileTitle}>{profile.title}</Text>
                  <Text style={styles.profilePrompt}>{profile.prompt}</Text>

                  <View style={styles.valueRow}>
                    {profile.values.map((value) => (
                      <View key={value} style={styles.valueChip}>
                        <Text style={styles.valueChipText}>{value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Pressable>

              <View style={styles.cardActions}>
                <Pressable style={styles.secondaryButton} onPress={() => handleSave(profile.id)}>
                  <Text style={styles.secondaryButtonText}>
                    {profile.saved ? 'Saved' : 'Save'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.primaryButton, profile.introRequested ? styles.primaryButtonMuted : null]}
                  onPress={() => handleIntro(profile.id)}>
                  <Text style={styles.primaryButtonText}>
                    {profile.introRequested ? 'Intro requested' : 'Request intro'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No profiles match that search.</Text>
            <Text style={styles.emptyBody}>Try a different city, value, or filter.</Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 30,
    gap: 14,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  filterRow: {
    gap: 10,
    paddingHorizontal: 2,
  },
  filterChip: {
    minHeight: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: shellSurface,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  filterChipActive: {
    backgroundColor: shellAccentSoft,
    borderColor: shellAccent,
  },
  filterText: {
    color: shellAccent,
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextActive: {
    color: shellAccentStrong,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    gap: 3,
    padding: 14,
    borderRadius: 18,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  summaryLabel: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  profileCard: {
    gap: 12,
    padding: 12,
    borderRadius: 28,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  profileOpenButton: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  visualArea: {
    height: 280,
    justifyContent: 'space-between',
    padding: 18,
  },
  initialBadge: {
    width: 88,
    height: 88,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  initialBadgeText: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '800',
  },
  visualMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  visualPill: {
    paddingHorizontal: 10,
    minHeight: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251, 250, 247, 0.88)',
  },
  visualPillText: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  profileCopy: {
    gap: 10,
    padding: 18,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  nameText: {
    color: theme.colors.text,
    fontSize: 26,
    lineHeight: 30,
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
  profilePrompt: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
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
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
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
    minHeight: 44,
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
  emptyCard: {
    gap: 6,
    padding: 20,
    borderRadius: 24,
    backgroundColor: shellCard,
    borderWidth: 1,
    borderColor: shellBorder,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyBody: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
});
