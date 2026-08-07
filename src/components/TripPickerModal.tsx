// ─── Trip Picker Modal ────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, useColorScheme, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DARK, LIGHT, FONT_SIZE, SPACE, RADIUS, BRAND } from '@/constants/theme';
import { useSubwayStore, SavedPlace, Trip } from '@/store/subway';

type Props = {
  visible: boolean;
  place: SavedPlace | null;
  onClose: () => void;
};

export function TripPickerModal({ visible, place, onClose }: Props) {
  const cs = useColorScheme();
  const t  = cs === 'dark' ? DARK : LIGHT;
  const { trips, createTrip, addPlaceToTrip, isPlaceInTrip } = useSubwayStore();
  const [newTripName, setNewTripName] = useState('');
  const [creating, setCreating] = useState(false);

  function handleAddToTrip(trip: Trip) {
    if (!place) return;
    addPlaceToTrip(trip.id, place);
    onClose();
  }

  function handleCreate() {
    if (!place || !newTripName.trim()) return;
    const trip = createTrip(newTripName.trim());
    addPlaceToTrip(trip.id, place);
    setNewTripName('');
    setCreating(false);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheet}>
        <View style={[styles.card, { backgroundColor: t.bgCard }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: t.borderInput }]} />

          <Text style={[styles.title, { color: t.textPrimary }]}>Add to Trip</Text>
          {place && (
            <Text style={[styles.placeName, { color: t.textSecondary }]}>{place.emoji} {place.name}</Text>
          )}

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {trips.map((trip) => {
              const already = place ? isPlaceInTrip(trip.id, place.id) : false;
              return (
                <TouchableOpacity
                  key={trip.id}
                  style={[styles.tripRow, { borderColor: t.borderCard }]}
                  onPress={() => !already && handleAddToTrip(trip)}
                  activeOpacity={already ? 1 : 0.75}
                >
                  <Ionicons name="map-outline" size={20} color={already ? BRAND.blue : t.textSecondary} />
                  <Text style={[styles.tripName, { color: already ? BRAND.blue : t.textPrimary }]}>
                    {trip.name}
                  </Text>
                  <Text style={[styles.tripCount, { color: t.textTertiary }]}>
                    {trip.places.length} {trip.places.length === 1 ? 'place' : 'places'}
                  </Text>
                  {already && <Ionicons name="checkmark-circle" size={18} color={BRAND.blue} />}
                </TouchableOpacity>
              );
            })}

            {/* New trip row */}
            {creating ? (
              <View style={[styles.newTripInput, { borderColor: t.borderCard }]}>
                <TextInput
                  style={[styles.input, { color: t.textPrimary }]}
                  placeholder="Trip name…"
                  placeholderTextColor={t.textTertiary}
                  value={newTripName}
                  onChangeText={setNewTripName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleCreate}
                />
                <TouchableOpacity onPress={handleCreate} disabled={!newTripName.trim()}>
                  <Ionicons name="checkmark-circle" size={24} color={newTripName.trim() ? BRAND.blue : t.textTertiary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setCreating(false); setNewTripName(''); }}>
                  <Ionicons name="close-circle-outline" size={24} color={t.textTertiary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.tripRow, { borderColor: t.borderCard }]}
                onPress={() => setCreating(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color={BRAND.blue} />
                <Text style={[styles.tripName, { color: BRAND.blue }]}>New trip…</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: t.bgInput }]} onPress={onClose}>
            <Text style={[styles.cancelText, { color: t.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet:        { flex: 1, justifyContent: 'flex-end' },
  card:         { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACE[5], paddingTop: SPACE[3], maxHeight: '75%' },
  handle:       { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: SPACE[4] },
  title:        { fontSize: FONT_SIZE.xl, fontWeight: '900', letterSpacing: -0.3, marginBottom: 4 },
  placeName:    { fontSize: FONT_SIZE.sm, fontWeight: '600', marginBottom: SPACE[4] },
  list:         { marginBottom: SPACE[3] },
  tripRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: SPACE[3], borderBottomWidth: 1 },
  tripName:     { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700' },
  tripCount:    { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  newTripInput: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: SPACE[3], borderBottomWidth: 1 },
  input:        { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '600' },
  cancelBtn:    { borderRadius: RADIUS.lg, padding: SPACE[4], alignItems: 'center', marginTop: SPACE[2] },
  cancelText:   { fontSize: FONT_SIZE.md, fontWeight: '700' },
});
