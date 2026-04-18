import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { theme } from '@/constants/theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  
  // Mock data for the specific chat
  const [messages, setMessages] = useState([
    { id: '1', text: 'Namaskaram, looking forward to the seva!', isMine: false },
    { id: '2', text: 'Yes, looking forward to seeing you there.', isMine: true },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: message, isMine: true }]);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen options={{ title: `Chat ${id}` }} />
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.isMine ? styles.myMessage : styles.theirMessage]}>
            <Text style={[styles.messageText, item.isMine ? styles.myMessageText : styles.theirMessageText]}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputWrap}>
        <Pressable style={styles.iconButton}>
          <FontAwesome name="plus" size={20} color={theme.colors.mutedText} />
        </Pressable>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Message..."
          placeholderTextColor={theme.colors.tabInactive}
          style={styles.input}
          multiline
        />
        <Pressable style={styles.iconButton} onPress={handleSend}>
          <FontAwesome name="send" size={18} color={theme.colors.profile} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  messageList: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.profile,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: theme.colors.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  iconButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: theme.colors.text,
    marginHorizontal: 8,
  },
});
