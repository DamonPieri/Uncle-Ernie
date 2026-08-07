// ─── Trip Detail Screen ───────────────────────────────────────────────────────
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const cs      = useColorScheme();
  const t       = cs === 'dark' ? DARK : LIGHT;
  const { trips, removePlaceFromTrip } = useSubwayStore();

  const trip = trips.find((tr) => tr.id === id);

  if (!trip) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={t.textSecondary} />
          <Text style={[styles.backText, { color: t.textSecondary }]}>Saved</Text>
        </TouchableOpacity>
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>Trip not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color={t.textSecondary} />
        <Text style={[styles.backText, { color: t.textSecondary }]}>Saved</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={[styles.tripIcon, { backgroundColor: BRAND.blue + '22' }]}>
          <Ionicons name="map" size={28} color={BRAND.blue} />
        </View>
        <Text style={[styles.tripName, { color: t.textPrimary }]}>{trip.name}</Text>
        <Text style={[styles.tripMeta, { color: t.textSecondary }]}>
          {trip.places.length} {trip.places.length === 1 ? 'place' : 'places'}
        </Text>
      </View>

      {trip.places.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="map-outline" size={40} color={t.textTertiary} />
          <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>No places yet</Text>
          <Text style={[styles.emptyBody, { color: t.textSecondary }]}>
            Tap "Trip" on any place in Explore to add it here.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SPACE[4], paddingBottom: 100 }}>
          {trip.places.map((place) => {
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
                  onPress={() => { haptic.light(); removePlaceFromTrip(trip.id, place.id); }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle-outline" size={22} color={t.textSecondary} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1 },
  backBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACE[4], paddingTop: SPACE[2], paddingBottom: SPACE[2] },
  backText:       { fontSize: FONT_SIZE.base, fontWeight: '600' },
  header:         { alignItems: 'center', paddingVertical: SPACE[5], paddingHorizontal: SPACE[4] },
  tripIcon:       { width: 64, height: 64, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', marginBottom: SPACE[3] },
  tripName:       { fontSize: FONT_SIZE['2xl'], fontWeight: '900', letterSpacing: -0.4, textAlign: 'center', marginBottom: 4 },
  tripMeta:       { fontSize: FONT_SIZE.sm, fontWeight: '600' },
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
