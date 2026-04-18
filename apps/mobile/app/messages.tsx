import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { theme } from '@/constants/theme';

const MOCK_CHATS = [
  { id: '1', name: 'Ramanuja Dasan', text: 'Namaskaram, looking forward to the seva!', time: '10:45 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Lakshmi N', text: 'Did you see the new post on Moksha?', time: 'Yesterday', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Srinavas', text: 'I have applied for the job you posted.', time: 'Tuesday', avatar: 'https://i.pravatar.cc/150?u=3' },
];

const MOCK_STATUSES = [
  { id: '1', name: 'Your Story', avatar: 'https://i.pravatar.cc/150?u=me', isAdd: true },
  { id: '2', name: 'Lakshmi', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Sri', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '4', name: 'Naveen', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '5', name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=6' },
];

export default function MessagesScreen() {
  const [search, setSearch] = useState('');

  const filteredChats = MOCK_CHATS.filter(chat => 
    chat.name.toLowerCase().includes(search.toLowerCase()) || 
    chat.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Messages' }} />
      
      <View style={styles.searchWrap}>
        <FontAwesome name="search" size={16} color={theme.colors.mutedText} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search messages..."
          placeholderTextColor={theme.colors.tabInactive}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.statusWrap}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MOCK_STATUSES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.statusItem}>
              <View style={[styles.statusAvatarWrap, item.isAdd && styles.statusAvatarAdd]}>
                <Image source={{ uri: item.avatar }} style={styles.statusAvatar} />
                {item.isAdd && (
                  <View style={styles.statusPlus}>
                    <FontAwesome name="plus" size={10} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={styles.statusName} numberOfLines={1}>{item.name}</Text>
            </View>
          )}
          contentContainerStyle={styles.statusListContent}
        />
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.chatRow} onPress={() => router.push(`/messages/${item.id}`)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.chatText} numberOfLines={1}>{item.text}</Text>
            </View>
            <Pressable style={styles.cameraIcon} onPress={() => console.log('Camera clicked')}>
              <FontAwesome name="camera" size={20} color={theme.colors.mutedText} />
            </Pressable>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 40,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  chatTime: {
    fontSize: 12,
    color: theme.colors.mutedText,
  },
  chatText: {
    fontSize: 14,
    color: theme.colors.mutedText,
  },
  cameraIcon: {
    padding: 8,
  },
  statusWrap: {
    marginBottom: 8,
  },
  statusListContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  statusItem: {
    alignItems: 'center',
    width: 60,
    gap: 6,
  },
  statusAvatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.colors.profile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusAvatarAdd: {
    borderColor: theme.colors.border,
  },
  statusAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.surface,
  },
  statusPlus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.profile,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.canvas,
  },
  statusName: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '600',
  },
});
