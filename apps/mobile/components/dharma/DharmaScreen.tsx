import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlobalHeader } from '@/components/shared/GlobalHeader';
import { theme } from '@/constants/theme';
import {
  type DharmaAgendaItem,
  type DharmaFilter,
  type DharmaPost,
  listDharmaData,
  toggleDharmaHelp,
  toggleDharmaSaved,
} from '@/lib/mockApi';

export default function DharmaScreen() {
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState<DharmaPost[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFocused) return;

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const data = await listDharmaData();

      if (!isMounted) return;

      setPosts(data.posts);
      setIsLoading(false);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const filteredPosts = posts.filter((post) => {
    const search = query.trim().toLowerCase();

    if (!search) return true;

    const haystack = `${post.title} ${post.description} ${post.organizer} ${post.location}`.toLowerCase();
    return haystack.includes(search);
  });

  const handleSave = async (id: string) => {
    const updated = await toggleDharmaSaved(id);
    setPosts((current) => current.map((post) => (post.id === id ? updated : post)));
  };

  const handleHelp = async (id: string) => {
    const updated = await toggleDharmaHelp(id);
    setPosts((current) => current.map((post) => (post.id === id ? updated : post)));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <GlobalHeader
        query={query}
        setQuery={setQuery}
        placeholder="Search requests, seva, local help"
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
            { id: 'Charity', icon: 'heart', active: true },
            { id: 'Volunteering', icon: 'handshake-o', active: false },
            { id: 'Temples', icon: 'bell', active: false },
          ].map((item) => (
            <Pressable key={item.id} style={[styles.navButton, item.active && styles.navButtonActive]} onPress={() => {}}>
              <FontAwesome name={item.icon as any} size={14} color={item.active ? '#ffffff' : theme.colors.dharma} style={styles.navIcon} />
              <Text style={[styles.navButtonTitle, item.active && styles.navButtonTitleActive]}>{item.id}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {isLoading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Loading community posts...</Text>
          </View>
        ) : filteredPosts.length ? (
          filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={[styles.postBadge, { backgroundColor: post.accent }]}>
                  <Text style={styles.postBadgeText}>{post.category}</Text>
                </View>

                <Pressable style={styles.iconButton} onPress={() => handleSave(post.id)}>
                  <FontAwesome
                    name={post.saved ? 'bookmark' : 'bookmark-o'}
                    size={15}
                    color={theme.colors.text}
                  />
                </Pressable>
              </View>

              <Pressable
                style={styles.postBodyButton}
                onPress={() => router.push(`/dharma/${post.id}`)}>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postDescription}>{post.description}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaPill}>
                    <FontAwesome name="user-o" size={12} color={theme.colors.dharma} />
                    <Text style={styles.metaText}>{post.organizer}</Text>
                  </View>
                  <View style={styles.metaPill}>
                    <FontAwesome name="map-marker" size={12} color={theme.colors.dharma} />
                    <Text style={styles.metaText}>{post.location}</Text>
                  </View>
                </View>
              </Pressable>

              <View style={styles.postFooter}>
                <Text style={styles.footerMeta}>{post.joinedCount} people joined</Text>

                <View style={styles.footerActions}>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => Alert.alert('Share link', 'A share sheet will connect here.')}>
                    <Text style={styles.secondaryButtonText}>Share</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.primaryButton, post.volunteered ? styles.primaryButtonMuted : null]}
                    onPress={() => handleHelp(post.id)}>
                    <Text style={styles.primaryButtonText}>
                      {post.volunteered ? 'Helping' : 'Offer help'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No requests match that filter.</Text>
            <Text style={styles.emptyBody}>Try another category or clear the search.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3fbf2',
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
    borderColor: '#d7ead2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonActive: {
    backgroundColor: theme.colors.dharma,
    borderColor: theme.colors.dharma,
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
  postCard: {
    gap: 14,
    padding: 18,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#d7ead2',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postBadge: {
    paddingHorizontal: 12,
    minHeight: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBadgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef7eb',
  },
  postBodyButton: {
    gap: 12,
  },
  postTitle: {
    color: theme.colors.text,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '800',
  },
  postDescription: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 22,
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
    backgroundColor: '#eef8ec',
  },
  metaText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  postFooter: {
    gap: 12,
  },
  footerMeta: {
    color: theme.colors.dharma,
    fontSize: 12,
    fontWeight: '700',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef7eb',
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dharma,
  },
  primaryButtonMuted: {
    backgroundColor: '#7fcf8b',
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
    borderColor: '#d7ead2',
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
