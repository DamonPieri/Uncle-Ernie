// ─── Saved Screen — Trips + Places ───────────────────────────────────────────
import { useRouter, useNavigation } from 'expo-router';
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

const CATEGORY_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  Food:    'restaurant-outline',
  Bars:    'beer-outline',
  Outdoor: 'leaf-outline',
  Culture: 'color-palette-outline',
  Coffee:  'cafe-outline',
  All:     'apps-outline',
};

export default function SavedScreen() {
  const router     = useRouter();
  const navigation = useNavigation();
  const cs = useColorScheme();
  const t  = cs === 'dark' ? DARK : LIGHT;
  const { trips, savedPlaces, unsavePlace, deleteTrip } = useSubwayStore();
  const canGoBack  = navigation.canGoBack();

  const hasAnything = trips.length > 0 || savedPlaces.length > 0;

  if (!hasAnything) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
        <View style={styles.header}>
          {canGoBack && (
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color={t.textSecondary} />
              <Text style={[styles.backText, { color: t.textSecondary }]}>Back</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: t.textPrimary }]}>Saved</Text>
        </View>
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={48} color={t.textTertiary} />
          <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>Nothing saved yet</Text>
          <Text style={[styles.emptyBody, { color: t.textSecondary }]}>
            Bookmark places or create trips from the Explore screen.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
      <View style={styles.header}>
        {canGoBack && (
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={t.textSecondary} />
            <Text style={[styles.backText, { color: t.textSecondary }]}>Back</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: t.textPrimary }]}>Saved</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Trips ── */}
        {trips.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: t.textTertiary }]}>TRIPS</Text>
            {trips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                style={[styles.tripCard, { backgroundColor: t.bgCard, borderColor: t.borderCard }]}
                onPress={() => router.push(`/trip/${trip.id}` as any)}
                activeOpacity={0.85}
              >
                <View style={[styles.tripIcon, { backgroundColor: BRAND.blue + '22' }]}>
                  <Ionicons name="map" size={22} color={BRAND.blue} />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={[styles.tripName, { color: t.textPrimary }]}>{trip.name}</Text>
                  <Text style={[styles.tripMeta, { color: t.textSecondary }]}>
                    {trip.places.length} {trip.places.length === 1 ? 'place' : 'places'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => { haptic.light(); deleteTrip(trip.id); }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={18} color={t.textTertiary} />
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={16} color={t.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Saved Places ── */}
        {savedPlaces.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: t.textTertiary }]}>SAVED PLACES</Text>
            {savedPlaces.map((place) => {
              const lineColor = LINE_COLORS[place.line] ?? '#808183';
              const darkText  = LINE_DARK_TEXT.has(place.line);
              return (
                <View
                  key={place.id}
                  style={[styles.placeCard, { backgroundColor: t.bgCard, borderColor: t.borderCard }]}
                >
                  <View style={[styles.placeIcon, { backgroundColor: t.bgIconWell }]}>
                    <Ionicons name={CATEGORY_ICON[place.category] ?? 'location-outline'} size={24} color={t.textPrimary} />
                  </View>
                  <View style={styles.placeInfo}>
                    <Text style={[styles.placeName, { color: t.textPrimary }]}>{place.name}</Text>
                    <Text style={[styles.placeTag, { color: t.textPrimary }]}>{place.tag}</Text>
                    <View style={styles.lineRow}>
                      <View style={[styles.lineBubble, { backgroundColor: lineColor }]}>
                        <Text style={[styles.lineBubbleText, { color: darkText ? '#1A1A1A' : '#fff', fontSize: place.line.length > 1 ? 8 : 11 }]}>
                          {place.line}
                        </Text>
                      </View>
                      <Text style={[styles.stopName, { color: t.textPrimary }]}>{place.stopName}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => { haptic.light(); unsavePlace(place.id); }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="bookmark" size={20} color={BRAND.blue} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1 },
  header:         { paddingHorizontal: SPACE[5], paddingTop: SPACE[4], marginBottom: SPACE[2] },
  backBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACE[2] },
  backText:       { fontSize: FONT_SIZE.base, fontWeight: '600' },
  title:          { fontSize: FONT_SIZE['3xl'], fontWeight: '900', letterSpacing: -0.5 },
  section:        { paddingHorizontal: SPACE[4], marginTop: SPACE[4] },
  sectionLabel:   { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: SPACE[3] },
  tripCard:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACE[4], borderRadius: RADIUS.xl, borderWidth: 1, marginBottom: 10 },
  tripIcon:       { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tripInfo:       { flex: 1 },
  tripName:       { fontSize: FONT_SIZE.md, fontWeight: '800', letterSpacing: -0.2, marginBottom: 2 },
  tripMeta:       { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  placeCard:      { flexDirection: 'row', alignItems: 'center', gap: 14, padding: SPACE[4], borderRadius: RADIUS.xl, borderWidth: 1, marginBottom: 10 },
  placeIcon:      { width: 48, height: 48, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  placeInfo:      { flex: 1, gap: 3 },
  placeName:      { fontSize: FONT_SIZE.md, fontWeight: '800', letterSpacing: -0.2 },
  placeTag:       { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  lineRow:        { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  lineBubble:     { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  lineBubbleText: { fontWeight: '900' },
  stopName:       { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  empty:          { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE[8], gap: SPACE[3] },
  emptyTitle:     { fontSize: FONT_SIZE.xl, fontWeight: '900', marginTop: SPACE[2] },
  emptyBody:      { fontSize: FONT_SIZE.base, textAlign: 'center', lineHeight: 22 },
});
