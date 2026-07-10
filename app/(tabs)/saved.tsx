// ─── Saved Places Screen ──────────────────────────────────────────────────────
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { haptic } from '@/hooks/useHaptics';
import { DARK, LIGHT, FONT_SIZE, SPACE, RADIUS, BRAND } from '@/constants/theme';
import { LINE_COLORS, LINE_DARK_TEXT } from '@/constants/theme';
import { useSubwayStore } from '@/store/subway';

export default function SavedScreen() {
  const cs = useColorScheme();
  const t  = cs === 'dark' ? DARK : LIGHT;
  const { savedPlaces, unsavePlace } = useSubwayStore();

  if (savedPlaces.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.textPrimary }]}>Saved Places</Text>
          <Text style={[styles.subtitle, { color: t.textSecondary }]}>Nothing saved yet</Text>
        </View>
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={48} color={t.textTertiary} />
          <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>No saved places</Text>
          <Text style={[styles.emptyBody, { color: t.textSecondary }]}>
            Tap the bookmark on any place in Explore to save it here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.textPrimary }]}>Saved Places</Text>
        <Text style={[styles.subtitle, { color: t.textSecondary }]}>
          {savedPlaces.length} {savedPlaces.length === 1 ? 'place' : 'places'} saved
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {savedPlaces.map((place) => {
          const lineColor = LINE_COLORS[place.line] ?? '#808183';
          const darkText  = LINE_DARK_TEXT.has(place.line);
          return (
            <View
              key={place.id}
              style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.borderCard }]}
            >
              <View style={[styles.placeIcon, { backgroundColor: t.bgIconWell }]}>
                <Text style={styles.placeEmoji}>{place.emoji}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={[styles.placeName, { color: t.textPrimary }]}>{place.name}</Text>
                <Text style={[styles.placeTag, { color: t.textSecondary }]}>{place.tag}</Text>
                <View style={styles.lineRow}>
                  <View style={[styles.lineBubble, { backgroundColor: lineColor }]}>
                    <Text style={[styles.lineBubbleText, { color: darkText ? '#1A1A1A' : '#fff', fontSize: place.line.length > 1 ? 8 : 11 }]}>
                      {place.line}
                    </Text>
                  </View>
                  <Text style={[styles.stopName, { color: t.textTertiary }]}>{place.stopName}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.unsaveBtn}
                onPress={() => { haptic.light(); unsavePlace(place.id); }}
              >
                <Ionicons name="bookmark" size={20} color={BRAND.blue} />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1 },
  header:          { paddingHorizontal: SPACE[5], paddingTop: SPACE[4], marginBottom: SPACE[4] },
  title:           { fontSize: FONT_SIZE['3xl'], fontWeight: '900', letterSpacing: -0.5, marginBottom: 4 },
  subtitle:        { fontSize: FONT_SIZE.sm, fontWeight: '500' },
  card:            { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: SPACE[4], marginBottom: 10, padding: SPACE[4], borderRadius: RADIUS.xl, borderWidth: 1 },
  placeIcon:       { width: 48, height: 48, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  placeEmoji:      { fontSize: 22 },
  cardInfo:        { flex: 1, gap: 3 },
  placeName:       { fontSize: FONT_SIZE.md, fontWeight: '800', letterSpacing: -0.2 },
  placeTag:        { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  lineRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  lineBubble:      { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  lineBubbleText:  { fontWeight: '900' },
  stopName:        { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  unsaveBtn:       { padding: 4 },
  empty:           { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE[8], gap: SPACE[3] },
  emptyTitle:      { fontSize: FONT_SIZE.xl, fontWeight: '900', marginTop: SPACE[2] },
  emptyBody:       { fontSize: FONT_SIZE.base, textAlign: 'center', lineHeight: 22 },
});
