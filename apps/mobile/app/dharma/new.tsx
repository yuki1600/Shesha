import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { createDharmaPost, type DharmaFilter } from '@/lib/mockApi';

const categories: Array<Exclude<DharmaFilter, 'All'>> = ['Urgent', 'Events', 'Teaching', 'Local'];

export default function NewDharmaPostScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<Exclude<DharmaFilter, 'All'>>('Local');
  const [isSaving, setIsSaving] = useState(false);

  const isReady = title.trim() && description.trim() && location.trim();

  const handleCreate = async () => {
    if (!isReady || isSaving) return;

    setIsSaving(true);
    await createDharmaPost({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      category,
    });
    setIsSaving(false);
    Alert.alert('Posted', 'Your local request has been created in the prototype.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="chevron-left" size={16} color={theme.colors.text} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>New community post</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {categories.map((item) => {
                const active = item === category;
                return (
                  <Pressable
                    key={item}
                    style={[styles.chip, active ? styles.chipActive : null]}
                    onPress={() => setCategory(item)}>
                    <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="What help or activity is this?"
              placeholderTextColor={theme.colors.tabInactive}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              placeholder="Area or temple"
              placeholderTextColor={theme.colors.tabInactive}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Details</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.multilineInput]}
              multiline
              placeholder="Explain what is needed, when, and any context volunteers should know."
              placeholderTextColor={theme.colors.tabInactive}
            />
          </View>

          <Pressable
            style={[styles.primaryButton, !isReady ? styles.primaryButtonDisabled : null]}
            onPress={handleCreate}>
            <Text style={styles.primaryButtonText}>
              {isSaving ? 'Posting...' : 'Create post'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f3',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
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
  card: {
    gap: 16,
    padding: 20,
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#e8eadf',
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  field: {
    gap: 8,
  },
  label: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    minHeight: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef3ea',
  },
  chipActive: {
    backgroundColor: theme.colors.dharma,
  },
  chipText: {
    color: theme.colors.dharma,
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#f8faf6',
    borderWidth: 1,
    borderColor: '#e5eadb',
    color: theme.colors.text,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dharma,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
