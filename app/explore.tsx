// ─── Explore Screen ───────────────────────────────────────────────────────────
import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { haptic } from '@/hooks/useHaptics';
import { DARK, LIGHT, FONT_SIZE, SPACE, RADIUS, BRAND } from '@/constants/theme';
import { LINE_COLORS } from '@/constants/theme';
import { useSubwayStore, SavedPlace } from '@/store/subway';
import { TripPickerModal } from '@/components/TripPickerModal';

type CategoryId = 'All' | 'Food' | 'Bars' | 'Outdoor' | 'Culture' | 'Coffee';

type Category = {
  id: CategoryId;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'] | null;
};

const CATEGORIES: Category[] = [
  { id: 'All',     label: 'All',     icon: null },
  { id: 'Food',    label: 'Food',    icon: 'restaurant-outline' },
  { id: 'Bars',    label: 'Bars',    icon: 'beer-outline' },
  { id: 'Outdoor', label: 'Outdoor', icon: 'leaf-outline' },
  { id: 'Culture', label: 'Culture', icon: 'color-palette-outline' },
  { id: 'Coffee',  label: 'Coffee',  icon: 'cafe-outline' },
];

const CATEGORY_ICON: Record<CategoryId, React.ComponentProps<typeof Ionicons>['name']> = {
  All:     'apps-outline',
  Food:    'restaurant-outline',
  Bars:    'beer-outline',
  Outdoor: 'leaf-outline',
  Culture: 'color-palette-outline',
  Coffee:  'cafe-outline',
};

const PLACEHOLDER_PLACES: Array<{
  id: string; category: CategoryId; name: string;
  tag: string; rating: number; dist: string; open: boolean;
}> = [
  { id: '1', category: 'Bars',    name: 'Rippers',          tag: 'Burgers & Beer', rating: 4.6, dist: '0.5 mi', open: true  },
  { id: '2', category: 'Outdoor', name: 'Rockaway Beach',   tag: 'Beach · Park',   rating: 4.8, dist: '0.7 mi', open: true  },
  { id: '3', category: 'Coffee',  name: 'Boardwalk Coffee', tag: 'Coffee',         rating: 4.4, dist: '1.1 mi', open: true  },
  { id: '4', category: 'Bars',    name: 'The Local Tap',    tag: 'Bar',            rating: 4.2, dist: '0.9 mi', open: false },
];

export default function ExploreScreen() {
  const router = useRouter();
  const cs     = useColorScheme();
  const t      = cs === 'dark' ? DARK : LIGHT;
  const { currentStop, selectedLine } = useSubwayStore();
  const [activeCategory, setActiveCategory] = useState<CategoryId>('All');
  const [tripTarget, setTripTarget] = useState<SavedPlace | null>(null);

  function toSavedPlace(place: typeof PLACEHOLDER_PLACES[0]): SavedPlace {
    return {
      id: place.id,
      name: place.name,
      category: place.category,
      tag: place.tag,
      rating: place.rating,
      dist: place.dist,
      open: place.open,
      line: selectedLine ?? '',
      stopName: currentStop?.name ?? '',
      stopId: currentStop?.id ?? '',
      savedAt: Date.now(),
    };
  }

  function openTripPicker(place: typeof PLACEHOLDER_PLACES[0]) {
    haptic.selection();
    setTripTarget(toSavedPlace(place));
  }

  const lineColor = selectedLine ? (LINE_COLORS[selectedLine] ?? BRAND.blue) : BRAND.blue;

  if (!currentStop) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🗺️</Text>
          <Text style={[styles.emptyTitle, { color: t.textPrimary }]}>No stop selected</Text>
          <Text style={[styles.emptyBody, { color: t.textSecondary }]}>
            Head back to the Explore tab and pick a subway line.
          </Text>
          <TouchableOpacity
            style={[styles.emptyBtn, { backgroundColor: t.btnPrimaryBg }]}
            onPress={() => router.push('/')}
          >
            <Text style={[styles.emptyBtnText, { color: t.btnPrimaryText }]}>Pick a line</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: t.bgPhone }]}>
      {/* Map Placeholder */}
      <View style={[styles.mapArea, { backgroundColor: t.bgMap }]}>
        <View style={styles.mapPin}>
          <View style={[styles.pinBubble, { backgroundColor: lineColor }]}>
            <Text style={styles.pinText}>{selectedLine ?? '?'}</Text>
          </View>
          <View style={[styles.pinTail, { backgroundColor: lineColor }]} />
        </View>

        {/* Map overlay header */}
        <SafeAreaView edges={['top']} style={styles.mapHeader}>
          <View>
            <Text style={[styles.stopName, { color: t.textPrimary }]}>{currentStop.name}</Text>
            <Text style={[styles.stopMeta, { color: t.textSecondary }]}>
              {currentStop.lines.join('·')} Train · {currentStop.neighborhood}, {currentStop.borough}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.rerollMapBtn, { backgroundColor: cs === 'dark' ? 'rgba(20,20,20,0.75)' : 'rgba(247,243,236,0.9)', borderColor: t.borderInput }]}
              onPress={() => router.back()}
            >
              <FontAwesome5 name="dice" size={14} color={t.textPrimary} />
              <Text style={[styles.rerollMapText, { color: t.textPrimary }]}> Re-roll</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.savedMapBtn, { backgroundColor: cs === 'dark' ? 'rgba(20,20,20,0.75)' : 'rgba(247,243,236,0.9)', borderColor: t.borderInput }]}
              onPress={() => router.push('/saved')}
            >
              <Ionicons name="bookmark-outline" size={18} color={t.textPrimary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <Text style={styles.mapLabel}>MAP COMING IN SPRINT 2</Text>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Filter strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterStrip}>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            const iconColor = active ? t.btnPrimaryText : t.textSecondary;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  { borderColor: t.borderInput },
                  active && { backgroundColor: t.btnPrimaryBg, borderColor: t.btnPrimaryBg },
                ]}
                onPress={() => { haptic.selection(); setActiveCategory(cat.id); }}
              >
                {cat.icon && <Ionicons name={cat.icon} size={14} color={iconColor} />}
                <Text style={[styles.chipText, { color: iconColor }]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.cards}>
          {/* Ernie's Pick */}
          <View style={styles.erniePick}>
            <View style={styles.ernieBadge}>
              <Text style={styles.ernieBadgeText}>✦ ERNIE'S PICK</Text>
            </View>
            <Text style={styles.erniesName}>Connolly's Beach Bar</Text>
            <Text style={styles.erniesDesc}>
              Old-school Rockaway spot that's survived every storm and still makes the best rum punch in Queens. Cash only, no tourists.
            </Text>
            <View style={styles.erniesMeta}>
              <Text style={styles.erniesMetaText}>BAR</Text>
              <View style={styles.metaDot} />
              <Text style={styles.erniesMetaText}>0.3 MI FROM STOP</Text>
            </View>
          </View>

          {/* Place Cards */}
          {PLACEHOLDER_PLACES.filter((p) => activeCategory === 'All' || p.category === activeCategory).map((place) => (
            <View key={place.id} style={[styles.placeCard, { backgroundColor: t.bgCard, borderColor: t.borderCard }]}>
              <View style={[styles.placeIcon, { backgroundColor: t.bgIconWell }]}>
                <Ionicons name={CATEGORY_ICON[place.category]} size={24} color={t.textPrimary} />
              </View>
              <View style={styles.placeInfo}>
                <Text style={[styles.placeName, { color: t.textPrimary }]}>{place.name}</Text>
                <View style={styles.placeMeta}>
                  <Text style={[styles.placeTag, { color: t.textSecondary }]}>{place.tag}</Text>
                  <View style={[styles.metaDot, { backgroundColor: t.borderInput }]} />
                  <Text style={[styles.placeRating, { color: t.ratingColor }]}>★ {place.rating}</Text>
                  <View style={[styles.metaDot, { backgroundColor: t.borderInput }]} />
                  <Text style={[styles.placeOpen, { color: place.open ? t.openColor : t.textTertiary }]}>
                    {place.open ? 'Open' : 'Closed'}
                  </Text>
                  <View style={[styles.metaDot, { backgroundColor: t.borderInput }]} />
                  <Text style={[styles.placeDist, { color: t.textTertiary }]}>{place.dist}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.tripBtn, { backgroundColor: t.bgInput }]}
                onPress={() => openTripPicker(place)}
              >
                <Ionicons name="map-outline" size={14} color={t.textPrimary} />
                <Text style={[styles.tripBtnText, { color: t.textPrimary }]}>Trip</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <TripPickerModal
        visible={tripTarget !== null}
        place={tripTarget}
        onClose={() => setTripTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1 },
  mapArea:        { height: 240, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  mapPin:         { alignItems: 'center' },
  pinBubble:      { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  pinText:        { fontSize: 18, fontWeight: '900', color: '#fff' },
  pinTail:        { width: 3, height: 12, borderRadius: 2 },
  mapLabel:       { position: 'absolute', bottom: 10, fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: 2 },
  mapHeader:      { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: SPACE[4], paddingTop: 4 },
  stopName:       { fontSize: FONT_SIZE.lg, fontWeight: '900', letterSpacing: -0.3 },
  stopMeta:       { fontSize: FONT_SIZE.xs, fontWeight: '600', marginTop: 2 },
  headerActions:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rerollMapBtn:   { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  rerollMapText:  { fontSize: FONT_SIZE.sm, fontWeight: '700' },
  savedMapBtn:    { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  filterStrip:    { paddingHorizontal: SPACE[4], paddingVertical: SPACE[4], gap: 8 },
  chip:           { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full, borderWidth: 1 },
  chipText:       { fontSize: FONT_SIZE.sm, fontWeight: '700', letterSpacing: 0.5 },
  cards:          { paddingHorizontal: SPACE[4], gap: 10 },
  erniePick:      { backgroundColor: BRAND.blue, borderRadius: RADIUS['2xl'], padding: SPACE[4], overflow: 'hidden' },
  ernieBadge:     { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10 },
  ernieBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1.5 },
  erniesName:     { fontSize: FONT_SIZE.xl, fontWeight: '900', color: '#fff', letterSpacing: -0.3, marginBottom: 4 },
  erniesDesc:     { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.68)', lineHeight: 18, marginBottom: 12 },
  erniesMeta:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  erniesMetaText: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  placeCard:      { borderRadius: RADIUS.xl, padding: SPACE[4], flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1 },
  placeIcon:      { width: 48, height: 48, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  placeInfo:      { flex: 1 },
  placeName:      { fontSize: FONT_SIZE.md, fontWeight: '700', letterSpacing: -0.2, marginBottom: 3 },
  placeMeta:      { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  placeTag:       { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  placeRating:    { fontSize: FONT_SIZE.xs, fontWeight: '700' },
  placeOpen:      { fontSize: FONT_SIZE.xs, fontWeight: '700' },
  placeDist:      { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  metaDot:        { width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(128,128,128,0.4)' },
  tripBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 4 },
  tripBtnText:    { fontSize: 10, fontWeight: '700' },
  empty:          { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACE[8], gap: SPACE[3] },
  emptyEmoji:     { fontSize: 48, marginBottom: SPACE[2] },
  emptyTitle:     { fontSize: FONT_SIZE['3xl'], fontWeight: '900', letterSpacing: -0.5 },
  emptyBody:      { fontSize: FONT_SIZE.base, textAlign: 'center', lineHeight: 22 },
  emptyBtn:       { marginTop: SPACE[2], borderRadius: RADIUS.lg, paddingHorizontal: SPACE[6], paddingVertical: SPACE[4] },
  emptyBtnText:   { fontSize: FONT_SIZE.md, fontWeight: '800' },
});
