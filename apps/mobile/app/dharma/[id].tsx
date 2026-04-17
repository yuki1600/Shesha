import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { type DharmaPost, getDharmaPost, toggleDharmaHelp, toggleDharmaSaved } from '@/lib/mockApi';

function resolveId(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function DharmaDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = resolveId(params.id);
  const [post, setPost] = useState<DharmaPost | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const load = async () => {
      const data = await getDharmaPost(id);
      if (isMounted) setPost(data);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSave = async () => {
    if (!post) return;
    const updated = await toggleDharmaSaved(post.id);
    setPost(updated);
  };

  const handleHelp = async () => {
    if (!post) return;
    const updated = await toggleDharmaHelp(post.id);
    setPost(updated);
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
              name={post?.saved ? 'bookmark' : 'bookmark-o'}
              size={16}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        {post ? (
          <>
            <View style={styles.heroCard}>
              <View style={[styles.badge, { backgroundColor: post.accent }]}>
                <Text style={styles.badgeText}>{post.category}</Text>
              </View>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.description}>{post.description}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaPill}>
                  <FontAwesome name="user-o" size={12} color={theme.colors.dharma} />
                  <Text style={styles.metaText}>{post.organizer}</Text>
                </View>
                <View style={styles.metaPill}>
                  <FontAwesome name="map-marker" size={12} color={theme.colors.dharma} />
                  <Text style={styles.metaText}>{post.location}</Text>
                </View>
                <View style={styles.metaPill}>
                  <FontAwesome name="users" size={12} color={theme.colors.dharma} />
                  <Text style={styles.metaText}>{post.joinedCount} joined</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              {post.body.map((paragraph) => (
                <Text key={paragraph} style={styles.bodyText}>
                  {paragraph}
                </Text>
              ))}
            </View>

            <View style={styles.actionRow}>
              <Pressable style={styles.secondaryButton} onPress={handleSave}>
                <Text style={styles.secondaryButtonText}>
                  {post.saved ? 'Saved' : 'Save post'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.primaryButton, post.volunteered ? styles.primaryButtonMuted : null]}
                onPress={handleHelp}>
                <Text style={styles.primaryButtonText}>
                  {post.volunteered ? 'Helping' : 'Offer help'}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.bodyText}>Loading post...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f3',
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
    borderColor: '#e8eadf',
  },
  heroCard: {
    gap: 14,
    padding: 20,
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#e8eadf',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    minHeight: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '800',
  },
  description: {
    color: theme.colors.mutedText,
    fontSize: 15,
    lineHeight: 23,
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
    backgroundColor: '#f4f6ef',
  },
  metaText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    gap: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#e8eadf',
  },
  bodyText: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 24,
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
    backgroundColor: '#f3f5ef',
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
    backgroundColor: theme.colors.dharma,
  },
  primaryButtonMuted: {
    backgroundColor: '#9eb390',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
