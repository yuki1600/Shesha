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

import { theme } from '@/constants/theme';
import {
  type DharmaAgendaItem,
  type DharmaFilter,
  type DharmaPost,
  listDharmaData,
  toggleDharmaHelp,
  toggleDharmaSaved,
} from '@/lib/mockApi';

const filters: DharmaFilter[] = ['All', 'Urgent', 'Events', 'Teaching', 'Local'];

export default function DharmaScreen() {
  const isFocused = useIsFocused();
  const [agenda, setAgenda] = useState<DharmaAgendaItem[]>([]);
  const [posts, setPosts] = useState<DharmaPost[]>([]);
  const [activeFilter, setActiveFilter] = useState<DharmaFilter>('All');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFocused) return;

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const data = await listDharmaData();

      if (!isMounted) return;

      setAgenda(data.agenda);
      setPosts(data.posts);
      setIsLoading(false);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const filteredPosts = posts.filter((post) => {
    const matchesFilter = activeFilter === 'All' || post.category === activeFilter;
    const search = query.trim().toLowerCase();

    if (!search) return matchesFilter;

    const haystack = `${post.title} ${post.description} ${post.organizer} ${post.location}`.toLowerCase();
    return matchesFilter && haystack.includes(search);
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.searchWrap}>
            <FontAwesome name="search" size={16} color={theme.colors.mutedText} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search requests, seva, local help"
              placeholderTextColor={theme.colors.tabInactive}
              style={styles.searchInput}
            />
          </View>

          <Pressable style={styles.composeButton} onPress={() => router.push('/dharma/new')}>
            <FontAwesome name="plus" size={16} color={theme.colors.dharma} />
          </Pressable>
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

        <View style={styles.agendaCard}>
          {agenda.map((item) => (
            <View key={item.id} style={styles.agendaRow}>
              <Text style={styles.agendaTime}>{item.time}</Text>
              <View style={styles.agendaCopy}>
                <Text style={styles.agendaTitle}>{item.title}</Text>
                <Text style={styles.agendaNote}>{item.note}</Text>
              </View>
            </View>
          ))}
        </View>

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
  topRow: {
    flexDirection: 'row',
    gap: 10,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#d7ead2',
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  composeButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#d7ead2',
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
    backgroundColor: '#e9f6e6',
  },
  filterChipActive: {
    backgroundColor: theme.colors.dharma,
  },
  filterText: {
    color: theme.colors.dharma,
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  agendaCard: {
    gap: 10,
    padding: 16,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#d7ead2',
  },
  agendaRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#f7fcf5',
  },
  agendaTime: {
    width: 62,
    color: theme.colors.dharma,
    fontSize: 13,
    fontWeight: '800',
  },
  agendaCopy: {
    flex: 1,
    gap: 3,
  },
  agendaTitle: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  agendaNote: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
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
