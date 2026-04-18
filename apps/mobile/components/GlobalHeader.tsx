import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, TextInput, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';

interface GlobalHeaderProps {
  query: string;
  setQuery: (text: string) => void;
  placeholder?: string;
}

export function GlobalHeader({ query, setQuery, placeholder = 'Search...' }: GlobalHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push('/profile')} style={styles.iconButton}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} // placeholder profile icon
          style={styles.profileAvatar}
        />
      </Pressable>

      <View style={styles.searchArea}>
        <FontAwesome name="search" size={14} color={theme.colors.mutedText} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.tabInactive}
          style={styles.searchInput}
        />
      </View>

      <Pressable onPress={() => console.log('Messaging clicked')} style={styles.iconButton}>
        <FontAwesome name="commenting-o" size={24} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
  },
  searchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    minHeight: 36,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    height: '100%',
  },
});
