import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MokshaContentCard } from '@/components/MokshaContentCard';
import { MokshaHistory } from '@/components/MokshaHistory';
import { GlobalHeader } from '@/components/GlobalHeader';
import { theme } from '@/constants/theme';
import {
  addMokshaPostComment,
  addMokshaVideoComment,
  listMokshaData,
  shareMokshaPost,
  shareMokshaVideo,
  toggleMokshaCreatorFollow,
  toggleMokshaPostReaction,
  toggleMokshaVideoReaction,
  type MokshaCreator,
  type MokshaFeedItem,
  type MokshaPost,
  type MokshaVideo,
} from '@/lib/mockApi';

export default function MokshaScreen() {
  const isFocused = useIsFocused();
  const [creators, setCreators] = useState<MokshaCreator[]>([]);
  const [videos, setVideos] = useState<MokshaVideo[]>([]);
  const [posts, setPosts] = useState<MokshaPost[]>([]);
  const [feed, setFeed] = useState<MokshaFeedItem[]>([]);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Media');
  const [isLoading, setIsLoading] = useState(true);
  const [videoCommentDrafts, setVideoCommentDrafts] = useState<Record<string, string>>({});
  const [postCommentDrafts, setPostCommentDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isFocused) return;

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const data = await listMokshaData();

      if (!isMounted) return;

      setCreators(data.creators);
      setVideos(data.videos);
      setPosts(data.posts);
      setFeed(data.feed);
      setIsLoading(false);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const creatorMap = useMemo(
    () =>
      creators.reduce<Record<string, MokshaCreator>>((accumulator, creator) => {
        accumulator[creator.id] = creator;
        return accumulator;
      }, {}),
    [creators],
  );

  const videoMap = useMemo(
    () =>
      videos.reduce<Record<string, MokshaVideo>>((accumulator, video) => {
        accumulator[video.id] = video;
        return accumulator;
      }, {}),
    [videos],
  );

  const postMap = useMemo(
    () =>
      posts.reduce<Record<string, MokshaPost>>((accumulator, post) => {
        accumulator[post.id] = post;
        return accumulator;
      }, {}),
    [posts],
  );

  const search = query.trim().toLowerCase();
  const creatorStrip = [...creators].sort((left, right) => Number(right.following) - Number(left.following));

  const filteredFeed = feed.filter((entry) => {
    if (!search) return true;

    if (entry.type === 'video') {
      const video = videoMap[entry.itemId];
      const creator = video ? creatorMap[video.creatorId] : null;

      if (!video || !creator) return false;

      return `${creator.name} ${video.title} ${video.description} ${creator.focus}`
        .toLowerCase()
        .includes(search);
    }

    const post = postMap[entry.itemId];
    const creator = post ? creatorMap[post.creatorId] : null;

    if (!post || !creator) return false;

    return `${creator.name} ${post.title} ${post.excerpt} ${post.body} ${creator.description}`
      .toLowerCase()
      .includes(search);
  });

  const handleToggleFollow = async (id: string) => {
    const updated = await toggleMokshaCreatorFollow(id);
    setCreators((current) => current.map((creator) => (creator.id === id ? updated : creator)));
  };

  const handleToggleVideoReaction = async (id: string) => {
    const updated = await toggleMokshaVideoReaction(id);
    setVideos((current) => current.map((video) => (video.id === id ? updated : video)));
  };

  const handleTogglePostReaction = async (id: string) => {
    const updated = await toggleMokshaPostReaction(id);
    setPosts((current) => current.map((post) => (post.id === id ? updated : post)));
  };

  const handleShareVideo = async (id: string) => {
    const updated = await shareMokshaVideo(id);
    setVideos((current) => current.map((video) => (video.id === id ? updated : video)));
  };

  const handleSharePost = async (id: string) => {
    const updated = await shareMokshaPost(id);
    setPosts((current) => current.map((post) => (post.id === id ? updated : post)));
  };

  const handleVideoComment = async (id: string) => {
    const comment = videoCommentDrafts[id]?.trim();
    if (!comment) return;

    const updated = await addMokshaVideoComment(id, comment);
    setVideos((current) => current.map((video) => (video.id === id ? updated : video)));
    setVideoCommentDrafts((current) => ({ ...current, [id]: '' }));
  };

  const handlePostComment = async (id: string) => {
    const comment = postCommentDrafts[id]?.trim();
    if (!comment) return;

    const updated = await addMokshaPostComment(id, comment);
    setPosts((current) => current.map((post) => (post.id === id ? updated : post)));
    setPostCommentDrafts((current) => ({ ...current, [id]: '' }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <GlobalHeader 
        query={query} 
        setQuery={setQuery} 
        placeholder="Search creators, videos, reflections" 
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
            { id: 'Media', icon: 'play-circle' },
            { id: 'Learning', icon: 'book' },
            { id: 'History', icon: 'hourglass-half' },
          ].map((item) => {
            const active = item.id === activeTab;
            return (
              <Pressable
                key={item.id}
                style={[styles.navButton, active && styles.navButtonActive]}
                onPress={() => setActiveTab(item.id)}>
                <FontAwesome
                  name={item.icon as any}
                  size={14}
                  color={active ? '#ffffff' : theme.colors.moksha}
                  style={styles.navIcon}
                />
                <Text style={[styles.navButtonTitle, active && styles.navButtonTitleActive]}>
                  {item.id}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {activeTab === 'History' ? (
          <MokshaHistory query={query} />
        ) : activeTab === 'Media' ? (
          <>
            <View style={styles.creatorSection}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.creatorRow}
            showsHorizontalScrollIndicator={false}>
            {creatorStrip.map((creator) => (
              <View key={creator.id} style={styles.creatorCard}>
                <Pressable style={styles.creatorCardTop} onPress={() => router.push(`/moksha/${creator.id}`)}>
                  <Image source={{ uri: creator.avatarUrl }} style={styles.creatorAvatar} />
                  <Text style={styles.creatorName} numberOfLines={2}>
                    {creator.name}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.followButton, creator.following ? styles.followButtonActive : null]}
                  onPress={() => handleToggleFollow(creator.id)}>
                  <Text
                    style={[
                      styles.followButtonText,
                      creator.following ? styles.followButtonTextActive : null,
                    ]}>
                    {creator.following ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Latest videos and posts</Text>
          <Text style={styles.sectionSubtitle}>A single feed with reactions, sharing, and comments.</Text>
        </View>

        {isLoading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Loading Moksha...</Text>
          </View>
        ) : filteredFeed.length ? (
          filteredFeed.map((entry) => {
            if (entry.type === 'video') {
              const video = videoMap[entry.itemId];
              const creator = video ? creatorMap[video.creatorId] : null;

              if (!video || !creator) return null;

              return (
                <MokshaContentCard
                  key={entry.id}
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
                  onPressCreator={() => router.push(`/moksha/${creator.id}`)}
                  onPressOpen={() => router.push(`/moksha/video/${video.id}`)}
                />
              );
            }

            const post = postMap[entry.itemId];
            const creator = post ? creatorMap[post.creatorId] : null;

            if (!post || !creator) return null;

            return (
              <MokshaContentCard
                key={entry.id}
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
                onPressCreator={() => router.push(`/moksha/${creator.id}`)}
              />
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No content matches that search.</Text>
            <Text style={styles.emptyBody}>Try a creator name or a simpler keyword.</Text>
          </View>
        )}
      </>
    ) : (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>Under Construction</Text>
        <Text style={styles.emptyBody}>This section is coming soon.</Text>
      </View>
    )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffbef',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 30,
    gap: 16,
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
    borderColor: '#f0dfb9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonActive: {
    backgroundColor: theme.colors.moksha,
    borderColor: theme.colors.moksha,
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
  creatorSection: {
    gap: 12,
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
  creatorRow: {
    gap: 12,
    paddingHorizontal: 2,
  },
  creatorCard: {
    width: 156,
    minHeight: 184,
    gap: 12,
    padding: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#f0dfb9',
  },
  creatorCardTop: {
    gap: 10,
    flex: 1,
  },
  creatorAvatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
  },
  creatorName: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    minHeight: 38,
  },
  followButton: {
    minHeight: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf7e3',
  },
  followButtonActive: {
    backgroundColor: theme.colors.moksha,
  },
  followButtonText: {
    color: theme.colors.moksha,
    fontSize: 13,
    fontWeight: '800',
  },
  followButtonTextActive: {
    color: '#ffffff',
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
    borderColor: '#f0dfb9',
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  emptyCard: {
    gap: 6,
    padding: 18,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#f0dfb9',
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
