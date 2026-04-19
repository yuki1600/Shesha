import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { theme } from '@/constants/theme';

interface ActionMenuModalProps {
  visible: boolean;
  onClose: () => void;
  activeTab?: string;
}

export function ActionMenuModal({ visible, onClose, activeTab = 'dharma' }: ActionMenuModalProps) {
  // Define dynamic options based on the active purushartha
  let options: Array<{ label: string; icon: React.ComponentProps<typeof FontAwesome>['name'] }> = [];

  switch (activeTab) {
    case 'dharma':
      options = [
        { label: 'Post Announcement', icon: 'bullhorn' },
        { label: 'Log Daily Practice', icon: 'check-square-o' },
        { label: 'Create Seva Activity', icon: 'handshake-o' },
      ];
      break;
    case 'artha':
      options = [
        { label: 'Post a New Job', icon: 'briefcase' },
        { label: 'Create Candidate Card', icon: 'id-card-o' },
        { label: 'View Saved Jobs', icon: 'bookmark-o' },
      ];
      break;
    case 'kama':
      options = [
        { label: 'Edit Match Profile', icon: 'edit' },
        { label: 'Review Intro Requests', icon: 'envelope-o' },
        { label: 'Adjust Match Filters', icon: 'sliders' },
      ];
      break;
    case 'moksha':
      options = [
        { label: 'Ask a Question', icon: 'question-circle-o' },
        { label: 'Write a Post', icon: 'pencil-square-o' },
        { label: 'View Saved Content', icon: 'bookmark-o' },
      ];
      break;
    default:
      options = [
        { label: 'Settings', icon: 'cog' },
      ];
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />
          <Text style={styles.title}>Quick Actions</Text>
          <View style={styles.optionsList}>
            {options.map((opt, i) => (
              <Pressable
                key={i}
                style={styles.optionRow}
                onPress={() => {
                  console.log('Action selected:', opt.label);
                  onClose();
                }}>
                <View style={styles.iconContainer}>
                  <FontAwesome name={opt.icon} size={20} color={theme.colors[activeTab as keyof typeof theme.colors] || theme.colors.text} />
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 280,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 24,
  },
  optionsList: {
    gap: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
