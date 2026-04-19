import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlobalHeader } from '@/components/shared/GlobalHeader';
import { theme } from '@/constants/theme';
import {
  type ArthaFilter,
  type ArthaJob,
  applyToArthaJob,
  listArthaJobs,
  toggleArthaSaved,
} from '@/lib/mockApi';

export default function ArthaScreen() {
  const isFocused = useIsFocused();
  const [jobs, setJobs] = useState<ArthaJob[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFocused) return;

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const data = await listArthaJobs();

      if (!isMounted) return;

      setJobs(data);
      setIsLoading(false);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const filteredJobs = jobs.filter((job) => {
    const search = query.trim().toLowerCase();
    const textMatches =
      !search ||
      `${job.role} ${job.company} ${job.location} ${job.skills.join(' ')}`.toLowerCase().includes(search);

    return textMatches;
  });

  const savedCount = jobs.filter((job) => job.saved).length;
  const appliedCount = jobs.filter((job) => job.applied).length;

  const handleSave = async (id: string) => {
    const updated = await toggleArthaSaved(id);
    setJobs((current) => current.map((job) => (job.id === id ? updated : job)));
  };

  const handleApply = async (id: string) => {
    const updated = await applyToArthaJob(id);
    setJobs((current) => current.map((job) => (job.id === id ? updated : job)));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <GlobalHeader
        query={query}
        setQuery={setQuery}
        placeholder="Search roles, companies, skills"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navRow}>
          {[
            { id: 'Careers', icon: 'briefcase', active: true },
            { id: 'Business', icon: 'building', active: false },
            { id: 'Investments', icon: 'line-chart', active: false },
          ].map((item) => (
            <Pressable key={item.id} style={[styles.navButton, item.active && styles.navButtonActive]} onPress={() => {}}>
              <FontAwesome name={item.icon as any} size={14} color={item.active ? '#ffffff' : theme.colors.artha} style={styles.navIcon} />
              <Text style={[styles.navButtonTitle, item.active && styles.navButtonTitleActive]}>{item.id}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {isLoading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Loading roles...</Text>
          </View>
        ) : filteredJobs.length ? (
          filteredJobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobTopRow}>
                <View style={[styles.companyBadge, { backgroundColor: job.accent }]}>
                  <Text style={styles.companyBadgeText}>{job.company.slice(0, 1)}</Text>
                </View>
                <View style={styles.jobCopy}>
                  <Text style={styles.jobRole}>{job.role}</Text>
                  <Text style={styles.jobCompany}>{job.company}</Text>
                </View>
                <Pressable style={styles.iconButton} onPress={() => handleSave(job.id)}>
                  <FontAwesome
                    name={job.saved ? 'bookmark' : 'bookmark-o'}
                    size={15}
                    color={theme.colors.text}
                  />
                </Pressable>
              </View>

              <Pressable style={styles.jobBodyButton} onPress={() => router.push(`/artha/${job.id}`)}>
                <View style={styles.jobMetaRow}>
                  <View style={styles.metaPill}>
                    <FontAwesome name="map-marker" size={12} color={theme.colors.artha} />
                    <Text style={styles.metaText}>{job.location}</Text>
                  </View>
                  <View style={styles.metaPill}>
                    <FontAwesome name="briefcase" size={12} color={theme.colors.artha} />
                    <Text style={styles.metaText}>{job.details}</Text>
                  </View>
                </View>

                <Text style={styles.jobNote}>{job.note}</Text>

                <View style={styles.skillRow}>
                  {job.skills.map((skill) => (
                    <View key={skill} style={styles.skillChip}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>

              <View style={styles.jobFooter}>
                <Pressable style={styles.secondaryButton} onPress={() => handleSave(job.id)}>
                  <Text style={styles.secondaryButtonText}>
                    {job.saved ? 'Saved' : 'Save'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.primaryButton, job.applied ? styles.primaryButtonMuted : null]}
                  onPress={() => handleApply(job.id)}>
                  <Text style={styles.primaryButtonText}>
                    {job.applied ? 'Applied' : 'Apply'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No jobs match that search.</Text>
            <Text style={styles.emptyBody}>Try a different keyword or filter.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f7ff',
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
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#d4e1fb',
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d4e1fb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonActive: {
    backgroundColor: theme.colors.artha,
    borderColor: theme.colors.artha,
  },
  navIcon: {
    marginRight: 2,
  },
  navButtonTitle: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  navButtonTitleActive: {
    color: '#ffffff',
  },
  jobCard: {
    gap: 14,
    padding: 18,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#d4e1fb',
  },
  jobTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyBadgeText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  jobCopy: {
    flex: 1,
    gap: 2,
  },
  jobRole: {
    color: theme.colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  jobCompany: {
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef3ff',
  },
  jobBodyButton: {
    gap: 12,
  },
  jobMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    minHeight: 34,
    borderRadius: 17,
    backgroundColor: '#edf3ff',
  },
  metaText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  jobNote: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    paddingHorizontal: 12,
    minHeight: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f0ff',
  },
  skillText: {
    color: theme.colors.artha,
    fontSize: 12,
    fontWeight: '700',
  },
  jobFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef3ff',
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
    backgroundColor: theme.colors.artha,
  },
  primaryButtonMuted: {
    backgroundColor: '#82a5eb',
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
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#d4e1fb',
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
