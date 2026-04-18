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

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.chatRow} onPress={() => console.log('Open chat', item.id)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.chatText} numberOfLines={1}>{item.text}</Text>
            </View>
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
});
