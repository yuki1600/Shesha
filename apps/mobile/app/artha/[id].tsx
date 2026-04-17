import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { applyToArthaJob, type ArthaJob, getArthaJob, toggleArthaSaved } from '@/lib/mockApi';

function resolveId(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function ArthaDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = resolveId(params.id);
  const [job, setJob] = useState<ArthaJob | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const load = async () => {
      const data = await getArthaJob(id);
      if (isMounted) setJob(data);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSave = async () => {
    if (!job) return;
    const updated = await toggleArthaSaved(job.id);
    setJob(updated);
  };

  const handleApply = async () => {
    if (!job) return;
    const updated = await applyToArthaJob(job.id);
    setJob(updated);
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
              name={job?.saved ? 'bookmark' : 'bookmark-o'}
              size={16}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        {job ? (
          <>
            <View style={styles.heroCard}>
              <View style={[styles.companyBadge, { backgroundColor: job.accent }]}>
                <Text style={styles.companyBadgeText}>{job.company.slice(0, 1)}</Text>
              </View>
              <Text style={styles.title}>{job.role}</Text>
              <Text style={styles.company}>{job.company}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaPill}>
                  <FontAwesome name="map-marker" size={12} color={theme.colors.artha} />
                  <Text style={styles.metaText}>{job.location}</Text>
                </View>
                <View style={styles.metaPill}>
                  <FontAwesome name="briefcase" size={12} color={theme.colors.artha} />
                  <Text style={styles.metaText}>{job.details}</Text>
                </View>
              </View>

              <Text style={styles.note}>{job.note}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Role summary</Text>
              <Text style={styles.bodyText}>{job.summary}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Key qualifications</Text>
              {job.qualifications.map((item) => (
                <View key={item} style={styles.listRow}>
                  <View style={styles.listDot} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillRow}>
                {job.skills.map((skill) => (
                  <View key={skill} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.secondaryButton} onPress={handleSave}>
                <Text style={styles.secondaryButtonText}>{job.saved ? 'Saved' : 'Save'}</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryButton, job.applied ? styles.primaryButtonMuted : null]}
                onPress={handleApply}>
                <Text style={styles.primaryButtonText}>{job.applied ? 'Applied' : 'Apply'}</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.bodyText}>Loading role...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7f8',
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
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#e2e8ea',
  },
  heroCard: {
    gap: 14,
    padding: 20,
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#e2e8ea',
  },
  companyBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyBadgeText: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
  },
  company: {
    color: theme.colors.mutedText,
    fontSize: 15,
    fontWeight: '700',
  },
  metaRow: {
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
    backgroundColor: '#f4f7f8',
  },
  metaText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  note: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  sectionCard: {
    gap: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#e2e8ea',
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
  listRow: {
    flexDirection: 'row',
    gap: 10,
  },
  listDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 9,
    backgroundColor: theme.colors.artha,
  },
  listText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 24,
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
    backgroundColor: '#eef3f4',
  },
  skillText: {
    color: theme.colors.artha,
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
    backgroundColor: '#f3f6f7',
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
    backgroundColor: theme.colors.artha,
  },
  primaryButtonMuted: {
    backgroundColor: '#7da2aa',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
