import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { theme } from '@/constants/theme';
import { listMokshaData, type Acharya } from '@/lib/mockApi';

export function MokshaHistory({ query }: { query: string }) {
  const [acharyas, setAcharyas] = useState<Acharya[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    listMokshaData().then((data) => {
      if (isMounted) {
        setAcharyas(data.acharyas);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Loading History...</Text>
      </View>
    );
  }

  const search = query.trim().toLowerCase();
  const filtered = acharyas.filter(a => {
    return !search || `${a.name} ${a.era} ${a.description} ${a.matha || ''}`.toLowerCase().includes(search);
  });

  const grouped = filtered.reduce((acc, acharya) => {
    if (!acc[acharya.era]) acc[acharya.era] = [];
    acc[acharya.era].push(acharya);
    return acc;
  }, {} as Record<string, Acharya[]>);

  const eraOrder = ['Pre-Ramanuja', 'Ramanuja', 'Post-Ramanuja'];

  return (
    <View style={styles.container}>
      {eraOrder.map(era => {
        const group = grouped[era];
        if (!group || group.length === 0) return null;

        return (
          <View key={era} style={styles.eraSection}>
            <View style={styles.eraHeader}>
              <View style={styles.timelineDot} />
              <Text style={styles.eraTitle}>{era} Era</Text>
            </View>
            <View style={styles.eraContent}>
              <View style={styles.timelineLine} />
              <View style={styles.nodesList}>
                {group.map((acharya) => (
                  <Pressable
                    key={acharya.id}
                    style={styles.nodeCard}
                    onPress={() => router.push(`/acharya/${acharya.id}`)}>
                    <Image source={{ uri: acharya.avatarUrl }} style={styles.avatar} />
                    <View style={styles.nodeBody}>
                      <Text style={styles.nodeName}>{acharya.name}</Text>
                      <Text style={styles.nodeTimeline}>{acharya.timeline}</Text>
                      {acharya.matha && (
                        <View style={styles.mathaBadge}>
                          <Text style={styles.mathaText}>{acharya.matha}</Text>
                        </View>
                      )}
                      <Text style={styles.nodeDesc} numberOfLines={2}>{acharya.description}</Text>
                    </View>
                    <FontAwesome name="chevron-right" size={12} color={theme.colors.mutedText} />
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        );
      })}

      {filtered.length === 0 && (
         <View style={styles.card}>
            <Text style={styles.cardTitle}>No Acharyas found</Text>
         </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  eraSection: {
    marginBottom: 0,
  },
  eraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.moksha,
    marginLeft: 4,
  },
  eraTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  eraContent: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#f0dfb9',
    marginLeft: 9,
    flexShrink: 0,
  },
  nodesList: {
    flex: 1,
    gap: 12,
    paddingBottom: 24,
  },
  nodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0dfb9',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f0ea',
  },
  nodeBody: {
    flex: 1,
    gap: 4,
  },
  nodeName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  nodeTimeline: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
  },
  mathaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fcf3e3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 2,
  },
  mathaText: {
    color: '#b45309',
    fontSize: 11,
    fontWeight: '700',
  },
  nodeDesc: {
    color: theme.colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: '#f0dfb9',
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
