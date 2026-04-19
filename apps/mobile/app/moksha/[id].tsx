import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MokshaContentCard } from '@/components/moksha/MokshaContentCard';
import { theme } from '@/constants/theme';
import {
  addMokshaPostComment,
  addMokshaVideoComment,
  getMokshaCreator,
  shareMokshaPost,
  shareMokshaVideo,
  toggleMokshaCreatorFollow,
  toggleMokshaPostReaction,
  toggleMokshaVideoReaction,
  type MokshaCreator,
  type MokshaPost,
  type MokshaVideo,
} from '@/lib/mockApi';

type CreatorTab = 'videos' | 'posts';

function resolveId(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function MokshaCreatorScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = resolveId(params.id);
  const [creator, setCreator] = useState<MokshaCreator | null>(null);
  const [videos, setVideos] = useState<MokshaVideo[]>([]);
  const [posts, setPosts] = useState<MokshaPost[]>([]);
  const [activeTab, setActiveTab] = useState<CreatorTab>('videos');
  const [query, setQuery] = useState('');
  const [videoCommentDrafts, setVideoCommentDrafts] = useState<Record<string, string>>({});
  const [postCommentDrafts, setPostCommentDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const load = async () => {
      const data = await getMokshaCreator(id);

      if (!isMounted) return;

      setCreator(data.creator);
      setVideos(data.videos);
      setPosts(data.posts);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const search = query.trim().toLowerCase();

  const filteredVideos = useMemo(
    () =>
      videos.filter((video) =>
        `${video.title} ${video.description} ${video.meta}`.toLowerCase().includes(search),
      ),
    [search, videos],
  );

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) =>
        `${post.title} ${post.excerpt} ${post.body} ${post.meta}`.toLowerCase().includes(search),
      ),
    [posts, search],
  );

  const handleFollow = async () => {
    if (!creator) return;

    const updated = await toggleMokshaCreatorFollow(creator.id);
    setCreator(updated);
  };

  const handleToggleVideoReaction = async (videoId: string) => {
    const updated = await toggleMokshaVideoReaction(videoId);
    setVideos((current) => current.map((video) => (video.id === videoId ? updated : video)));
  };

  const handleTogglePostReaction = async (postId: string) => {
    const updated = await toggleMokshaPostReaction(postId);
    setPosts((current) => current.map((post) => (post.id === postId ? updated : post)));
  };

  const handleShareVideo = async (videoId: string) => {
    const updated = await shareMokshaVideo(videoId);
    setVideos((current) => current.map((video) => (video.id === videoId ? updated : video)));
  };

  const handleSharePost = async (postId: string) => {
    const updated = await shareMokshaPost(postId);
    setPosts((current) => current.map((post) => (post.id === postId ? updated : post)));
  };

  const handleVideoComment = async (videoId: string) => {
    const comment = videoCommentDrafts[videoId]?.trim();
    if (!comment) return;

    const updated = await addMokshaVideoComment(videoId, comment);
    setVideos((current) => current.map((video) => (video.id === videoId ? updated : video)));
    setVideoCommentDrafts((current) => ({ ...current, [videoId]: '' }));
  };

  const handlePostComment = async (postId: string) => {
    const comment = postCommentDrafts[postId]?.trim();
    if (!comment) return;

    const updated = await addMokshaPostComment(postId, comment);
    setPosts((current) => current.map((post) => (post.id === postId ? updated : post)));
    setPostCommentDrafts((current) => ({ ...current, [postId]: '' }));
  };

  const selectedCount = activeTab === 'videos' ? filteredVideos.length : filteredPosts.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="chevron-left" size={16} color={theme.colors.text} />
          </Pressable>
          <Pressable
            style={[styles.followButton, creator?.following ? styles.followButtonActive : null]}
            onPress={handleFollow}>
            <FontAwesome
              name={creator?.following ? 'check-circle' : 'plus-circle'}
              size={14}
              color={creator?.following ? '#ffffff' : theme.colors.moksha}
            />
            <Text
              style={[
                styles.followButtonText,
                creator?.following ? styles.followButtonTextActive : null,
              ]}>
              {creator?.following ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        </View>

        {creator ? (
          <>
            <View style={styles.heroCard}>
              <View style={[styles.heroVisual, { backgroundColor: creator.portraitTint }]}>
                <Image source={{ uri: creator.avatarUrl }} style={styles.heroImage} />
              </View>

              <View style={styles.heroCopy}>
                <Text style={styles.nameText}>{creator.name}</Text>
                <Text style={styles.description}>{creator.description}</Text>
                <Text style={styles.bio}>{creator.bio}</Text>

                <View style={styles.statRow}>
                  <View style={styles.statChip}>
                    <Text style={styles.statValue}>{creator.followers}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Text style={styles.statValue}>{creator.yearsActive}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                  </View>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Focus</Text>
                    <Text style={styles.infoValue}>{creator.focus}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Tradition</Text>
                    <Text style={styles.infoValue}>{creator.tradition}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{creator.location}</Text>
                  </View>
                </View>

                <View style={styles.factRow}>
                  {creator.facts.map((fact) => (
                    <View key={fact} style={styles.factChip}>
                      <Text style={styles.factChipText}>{fact}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.searchWrap}>
              <FontAwesome name="search" size={16} color={theme.colors.mutedText} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={`Search ${creator.name}'s videos or posts`}
                placeholderTextColor={theme.colors.tabInactive}
                style={styles.searchInput}
              />
            </View>

            <View style={styles.tabRow}>
              <TabChip
                active={activeTab === 'videos'}
                label={`Videos (${videos.length})`}
                onPress={() => setActiveTab('videos')}
              />
              <TabChip
                active={activeTab === 'posts'}
                label={`Posts (${posts.length})`}
                onPress={() => setActiveTab('posts')}
              />
            </View>

            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>
                {activeTab === 'videos' ? 'Latest videos' : 'Latest posts'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {selectedCount} item{selectedCount === 1 ? '' : 's'} matching this creator view.
              </Text>
            </View>

            {activeTab === 'videos' ? (
              filteredVideos.length ? (
                filteredVideos.map((video) => (
                  <MokshaContentCard
                    key={video.id}
                    kind="video"
                    creatorName={creator.name}
                    creatorAvatarUrl={creator.avatarUrl}
                    title={video.title}
                    meta={video.meta}
                    accent={video.accent}
                    description={video.description}
                    duration={video.duration}
                    liked={video.liked}
                    likes={video.likes}
                    shares={video.shares}
                    comments={video.comments}
                    commentDraft={videoCommentDrafts[video.id] ?? ''}
                    onChangeCommentDraft={(value) =>
                      setVideoCommentDrafts((current) => ({ ...current, [video.id]: value }))
                    }
                    onSubmitComment={() => handleVideoComment(video.id)}
                    onToggleLike={() => handleToggleVideoReaction(video.id)}
                    onShare={() => handleShareVideo(video.id)}
                    onPressCreator={() => {}}
                    onPressOpen={() => router.push(`/moksha/video/${video.id}`)}
                  />
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No videos match that search.</Text>
                  <Text style={styles.emptyBody}>Try a broader keyword for this creator.</Text>
                </View>
              )
            ) : filteredPosts.length ? (
              filteredPosts.map((post) => (
                <MokshaContentCard
                  key={post.id}
                  kind="post"
                  creatorName={creator.name}
                  creatorAvatarUrl={creator.avatarUrl}
                  title={post.title}
                  meta={post.meta}
                  accent={post.accent}
                  description={`${post.excerpt}\n\n${post.body}`}
                  liked={post.liked}
                  likes={post.likes}
                  shares={post.shares}
                  comments={post.comments}
                  commentDraft={postCommentDrafts[post.id] ?? ''}
                  onChangeCommentDraft={(value) =>
                    setPostCommentDrafts((current) => ({ ...current, [post.id]: value }))
                  }
                  onSubmitComment={() => handlePostComment(post.id)}
                  onToggleLike={() => handleTogglePostReaction(post.id)}
                  onShare={() => handleSharePost(post.id)}
                  onPressCreator={() => {}}
                />
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No posts match that search.</Text>
                <Text style={styles.emptyBody}>Try a broader keyword for this creator.</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Loading creator...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TabChip({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.tabChip, active ? styles.tabChipActive : null]} onPress={onPress}>
      <Text style={[styles.tabChipText, active ? styles.tabChipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.sunWash,
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
    alignItems: 'center',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    minHeight: 42,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  followButtonActive: {
    backgroundColor: theme.colors.moksha,
    borderColor: theme.colors.moksha,
  },
  followButtonText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  followButtonTextActive: {
    color: '#ffffff',
  },
  heroCard: {
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroVisual: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 132,
    height: 132,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
  },
  heroCopy: {
    gap: 12,
    padding: 20,
  },
  nameText: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  description: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  bio: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 22,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statChip: {
    flex: 1,
    gap: 2,
    padding: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
  },
  infoGrid: {
    gap: 10,
  },
  infoItem: {
    gap: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoValue: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  factRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  factChip: {
    paddingHorizontal: 12,
    minHeight: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.lotusWash,
  },
  factChipText: {
    color: theme.colors.saffronDeep,
    fontSize: 12,
    fontWeight: '800',
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
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  tabChipActive: {
    backgroundColor: '#dbeafe',
  },
  tabChipText: {
    color: theme.colors.mutedText,
    fontSize: 13,
    fontWeight: '800',
  },
  tabChipTextActive: {
    color: theme.colors.saffronDeep,
  },
  sectionHeading: {
    gap: 4,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
  },
  emptyCard: {
    gap: 6,
    padding: 18,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyBody: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 19,
  },
});
