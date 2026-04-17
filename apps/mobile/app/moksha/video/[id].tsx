import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { theme } from '@/constants/theme';
import { getMokshaVideo, type MokshaCreator, type MokshaVideo } from '@/lib/mockApi';

function resolveId(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function buildPlayerMarkup(url: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: #000;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
          }
        </style>
      </head>
      <body>
        <video src="${url}" controls autoplay playsinline webkit-playsinline></video>
      </body>
    </html>
  `;
}

export default function MokshaVideoModal() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = resolveId(params.id);
  const [video, setVideo] = useState<MokshaVideo | null>(null);
  const [creator, setCreator] = useState<MokshaCreator | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const load = async () => {
      const data = await getMokshaVideo(id);

      if (!isMounted) return;

      setVideo(data.video);
      setCreator(data.creator);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const html = useMemo(() => (video ? buildPlayerMarkup(video.streamUrl) : ''), [video]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <FontAwesome name="close" size={18} color="#ffffff" />
          </Pressable>
        </View>

        {video && creator ? (
          <>
            <View style={styles.playerShell}>
              <WebView
                originWhitelist={['*']}
                source={{ html }}
                style={styles.webview}
                allowsFullscreenVideo
                mediaPlaybackRequiresUserAction={false}
              />
            </View>

            <View style={styles.copyCard}>
              <Text style={styles.title}>{video.title}</Text>
              <Text style={styles.meta}>
                {creator.name} · {video.meta}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.copyCard}>
            <Text style={styles.title}>Loading video...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  playerShell: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  copyCard: {
    gap: 6,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#171a20',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  meta: {
    color: '#c1c7d0',
    fontSize: 13,
    lineHeight: 18,
  },
});
