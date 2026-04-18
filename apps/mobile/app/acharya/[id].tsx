import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { getAcharya, type Acharya } from '@/lib/mockApi';

export default function AcharyaDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [acharya, setAcharya] = useState<Acharya | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      getAcharya(id).then((data) => {
        if (isMounted) {
          setAcharya(data);
          setIsLoading(false);
        }
      }).catch(() => {
        if (isMounted) setIsLoading(false);
      });
    }
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!acharya) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Text style={styles.loadingText}>Acharya not found.</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
           <Text style={styles.backBtnText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <FontAwesome name="chevron-down" size={16} color={theme.colors.text} />
          </Pressable>
        </View>

        <View style={styles.profileHero}>
          <Image source={{ uri: acharya.avatarUrl }} style={styles.heroAvatar} />
          <Text style={styles.name}>{acharya.name}</Text>
          <Text style={styles.era}>{acharya.era} Era · {acharya.timeline}</Text>
          {acharya.matha && (
             <View style={styles.mathaBadge}>
                <Text style={styles.mathaText}>{acharya.matha}</Text>
             </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bodyText}>{acharya.description}</Text>
        </View>

        {acharya.works && acharya.works.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Works</Text>
            {acharya.works.map((work) => (
              <View key={work} style={styles.workPill}>
                 <FontAwesome name="book" size={14} color={theme.colors.moksha} />
                 <Text style={styles.workText}>{work}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fffbef',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fffbef',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 18,
    marginTop: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0dfb9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 32,
  },
  heroAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f3f0ea',
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  era: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.mutedText,
    textAlign: 'center',
  },
  mathaBadge: {
    backgroundColor: '#fcf3e3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  mathaText: {
    color: '#b45309',
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text,
  },
  workPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0dfb9',
  },
  workText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.mutedText,
  },
  backBtn: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0dfb9',
    borderRadius: 12,
  },
  backBtnText: {
    fontWeight: '700',
    color: theme.colors.text,
  }
});
