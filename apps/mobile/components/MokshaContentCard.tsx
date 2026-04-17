import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInput as TextInputHandle,
} from 'react-native';

import { theme } from '@/constants/theme';

type MokshaContentCardProps = {
  kind: 'video' | 'post';
  creatorName: string;
  creatorAvatarUrl: string;
  title: string;
  meta: string;
  accent: string;
  description: string;
  duration?: string;
  liked: boolean;
  likes: number;
  shares: number;
  comments: string[];
  commentDraft: string;
  onChangeCommentDraft: (value: string) => void;
  onSubmitComment: () => void;
  onToggleLike: () => void;
  onShare: () => void;
  onPressCreator: () => void;
  onPressOpen?: () => void;
};

export function MokshaContentCard({
  kind,
  creatorName,
  creatorAvatarUrl,
  title,
  meta,
  accent,
  description,
  duration,
  liked,
  likes,
  shares,
  comments,
  commentDraft,
  onChangeCommentDraft,
  onSubmitComment,
  onToggleLike,
  onShare,
  onPressCreator,
  onPressOpen,
}: MokshaContentCardProps) {
  const inputRef = useRef<TextInputHandle | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const visibleComments = comments.slice(-2);
  const commentCount = comments.length;
  const primaryBody =
    kind === 'video' ? (
      <Pressable
        style={[styles.videoShell, { backgroundColor: accent }]}
        onPress={onPressOpen}
        disabled={!onPressOpen}>
        <FontAwesome name="play-circle" size={38} color={theme.colors.text} />
        {duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        ) : null}
        <View style={styles.videoCopy}>
          <Text style={styles.videoTitle}>{title}</Text>
          <Text style={styles.videoDescription}>{description}</Text>
        </View>
      </Pressable>
    ) : (
      <View style={[styles.postBody, { backgroundColor: accent }]}>
        <Text style={styles.postTitle}>{title}</Text>
        <Text style={styles.postDescription}>{description}</Text>
      </View>
    );

  return (
    <View style={styles.card}>
      <Pressable style={styles.headerRow} onPress={onPressCreator}>
        <Image source={{ uri: creatorAvatarUrl }} style={styles.avatar} />
        <View style={styles.headerCopy}>
          <Text style={styles.creatorName}>{creatorName}</Text>
          <Text style={styles.metaText}>{meta}</Text>
        </View>
        <View style={styles.kindPill}>
          <Text style={styles.kindPillText}>{kind === 'video' ? 'Video' : 'Post'}</Text>
        </View>
      </Pressable>

      {primaryBody}

      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <IconButton active={liked} icon={liked ? 'heart' : 'heart-o'} onPress={onToggleLike} />
          <IconButton
            icon="comment-o"
            onPress={() => {
              setCommentsOpen((current) => !current);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
          />
          <IconButton icon="paper-plane-o" onPress={onShare} />
        </View>
      </View>

      <View style={styles.metaBlock}>
        <Text style={styles.likesText}>
          {formatCount(likes)} likes{shares ? ` · ${formatCount(shares)} shares` : ''}
        </Text>
        <Pressable
          onPress={() => setCommentsOpen((current) => !current)}
          disabled={!commentCount && !commentDraft.trim()}>
          <Text style={styles.commentsLinkText}>
            {commentCount ? `View ${commentCount} comment${commentCount === 1 ? '' : 's'}` : 'Add a comment'}
          </Text>
        </Pressable>
      </View>

      {commentsOpen ? (
        <View style={styles.commentsBlock}>
          {visibleComments.length ? (
            visibleComments.map((comment, index) => (
              <View key={`${comment}-${index}`} style={styles.commentChip}>
                <Text style={styles.commentText}>{comment}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyCommentText}>No comments yet. Start the discussion.</Text>
          )}

          <View style={styles.commentComposer}>
            <TextInput
              ref={inputRef}
              value={commentDraft}
              onChangeText={onChangeCommentDraft}
              placeholder="Add a comment..."
              placeholderTextColor={theme.colors.tabInactive}
              style={styles.commentInput}
            />
            <Pressable
              style={[
                styles.commentPostButton,
                !commentDraft.trim() ? styles.commentPostDisabled : null,
              ]}
              onPress={onSubmitComment}
              disabled={!commentDraft.trim()}>
              <Text style={styles.commentPostText}>Post</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function IconButton({
  active = false,
  icon,
  onPress,
}: {
  active?: boolean;
  icon: keyof typeof FontAwesome.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress}>
      <FontAwesome
        name={icon}
        size={22}
        color={active ? theme.colors.moksha : theme.colors.text}
      />
    </Pressable>
  );
}

function formatCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return String(value);
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    padding: 16,
    borderRadius: 26,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  creatorName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  metaText: {
    color: theme.colors.mutedText,
    fontSize: 12,
    lineHeight: 17,
  },
  kindPill: {
    paddingHorizontal: 10,
    minHeight: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  kindPillText: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '800',
  },
  videoShell: {
    minHeight: 236,
    padding: 18,
    borderRadius: 22,
    justifyContent: 'space-between',
  },
  durationBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    minHeight: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.84)',
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  videoCopy: {
    gap: 8,
  },
  videoTitle: {
    color: theme.colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  videoDescription: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  postBody: {
    gap: 10,
    padding: 18,
    borderRadius: 22,
  },
  postTitle: {
    color: theme.colors.text,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '800',
  },
  postDescription: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  iconButton: {
    minHeight: 26,
    minWidth: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaBlock: {
    gap: 4,
  },
  likesText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  commentsLinkText: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  commentsBlock: {
    gap: 10,
    paddingTop: 2,
  },
  commentChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
  },
  commentText: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyCommentText: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  commentInput: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: theme.colors.text,
    fontSize: 14,
  },
  commentPostButton: {
    minWidth: 56,
    minHeight: 40,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  commentPostDisabled: {
    opacity: 0.45,
  },
  commentPostText: {
    color: theme.colors.moksha,
    fontSize: 13,
    fontWeight: '800',
  },
  commentComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
});
