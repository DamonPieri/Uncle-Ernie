// ─── Saved Stops Screen ───────────────────────────────────────────────────────
import { useRouter } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DARK, LIGHT, FONT_SIZE, SPACE, RADIUS } from '@/constants/theme';
import { LINE_COLORS, LINE_DARK_TEXT } from '@/constants/theme';
import { useSubwayStore } from '@/store/subway';

export default function SavedScreen() {
  const router = useRouter();
  const cs     = useColorScheme();
  const t      = cs === 'dark' ? DARK : LIGHT;
  const { savedStops, setCurrentStop, unsaveStop } = useSubwayStore();

  if (savedStops.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.textPrimary }]}>Saved Stops</Text>
          <Text style={[styles.subtitle, { color: t.textSecondary }]}>0 adventures saved</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔖</Text>
          <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>Nothing saved yet</Text>
          <Text style={[styles.emptyBody, { color: t.textSecondary }]}>
            Roll a stop and tap 🔖 to save your adventures.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.textPrimary }]}>Saved Stops</Text>
        <Text style={[styles.subtitle, { color: t.textSecondary }]}>
          {savedStops.length} {savedStops.length === 1 ? 'adventure' : 'adventures'} saved
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {savedStops.map((stop) => {
          const line      = stop.lines[0];
          const lineColor = LINE_COLORS[line] ?? '#808183';
          const darkText  = LINE_DARK_TEXT.has(line);
          return (
            <TouchableOpacity
              key={stop.id}
              style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.borderCard }]}
              onPress={() => {
                setCurrentStop(stop);
                router.push('/(tabs)/explore');
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.lineDot, { backgroundColor: lineColor }]}>
                <Text style={[styles.lineDotText, { color: darkText ? '#1A1A1A' : '#fff', fontSize: line.length > 1 ? 10 : 16 }]}>
                  {line}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardName, { color: t.textPrimary }]}>{stop.name}</Text>
                <Text style={[styles.cardMeta, { color: t.textSecondary }]}>
                  {stop.neighborhood} · {stop.borough}
                </Text>
              </View>
              <Text style={[styles.arrow, { color: t.textTertiary }]}>›</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  header:      { paddingHorizontal: SPACE[5], paddingTop: SPACE[4], marginBottom: SPACE[5] },
  title:       { fontSize: FONT_SIZE['3xl'], fontWeight: '900', letterSpacing: -0.5, marginBottom: 4 },
  subtitle:    { fontSize: FONT_SIZE.sm, fontWeight: '500' },
  card:        { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: SPACE[4], marginBottom: 10, padding: SPACE[4], borderRadius: RADIUS.xl, borderWidth: 1 },
  lineDot:     { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lineDotText: { fontWeight: '900' },
  cardInfo:    { flex: 1 },
  cardName:    { fontSize: FONT_SIZE.md, fontWeight: '800', letterSpacing: -0.2, marginBottom: 3 },
  cardMeta:    { fontSize: FONT_SIZE.sm, fontWeight: '500' },
  arrow:       { fontSize: 20 },
  empty:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE[8], gap: SPACE[3] },
  emptyEmoji:  { fontSize: 48, marginBottom: SPACE[2] },
  emptyTitle:  { fontSize: FONT_SIZE.xl, fontWeight: '900' },
  emptyBody:   { fontSize: FONT_SIZE.base, textAlign: 'center', lineHeight: 22 },
});
