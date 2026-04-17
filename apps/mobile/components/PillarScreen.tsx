import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';

type Highlight = {
  label: string;
  value: string;
};

type Item = {
  eyebrow?: string;
  title: string;
  description: string;
};

type Section = {
  title: string;
  items: Item[];
};

type PillarScreenProps = {
  accentColor: string;
  badge: string;
  title: string;
  description: string;
  highlights: Highlight[];
  sections: Section[];
  footer?: ReactNode;
};

export function PillarScreen({
  accentColor,
  highlights,
  sections,
  footer,
}: PillarScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {highlights.length ? (
          <View style={styles.highlightGrid}>
            {highlights.map((highlight) => (
              <View
                key={highlight.label}
                style={[styles.highlightCard, { borderTopColor: accentColor }]}>
                <Text style={styles.highlightLabel}>{highlight.label}</Text>
                <Text style={styles.highlightValue}>{highlight.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {sections.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.itemList}>
              {section.items.map((item) => (
                <View key={item.title} style={styles.itemCard}>
                  {item.eyebrow ? (
                    <Text style={styles.itemEyebrow}>{item.eyebrow}</Text>
                  ) : null}
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {footer ? <View style={styles.footerWrap}>{footer}</View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    gap: 18,
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  highlightCard: {
    minWidth: '30%',
    flexGrow: 1,
    gap: 4,
    borderRadius: 20,
    padding: 14,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderTopWidth: 3,
  },
  highlightLabel: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.35,
    textTransform: 'uppercase',
  },
  highlightValue: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  sectionCard: {
    gap: 14,
    padding: 18,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
  },
  itemList: {
    gap: 12,
  },
  itemCard: {
    gap: 6,
    padding: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
  },
  itemEyebrow: {
    color: theme.colors.mutedText,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  itemTitle: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  itemDescription: {
    color: theme.colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  footerWrap: {
    gap: 12,
  },
});
