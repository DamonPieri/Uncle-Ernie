// ─── Settings Screen ──────────────────────────────────────────────────────────
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DARK, LIGHT, FONT_SIZE, SPACE } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const cs = useColorScheme();
  const t  = cs === 'dark' ? DARK : LIGHT;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color={t.textSecondary} />
        <Text style={[styles.backText, { color: t.textSecondary }]}>Back</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.textPrimary }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: t.textSecondary }]}>Coming in Sprint 5</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn:   { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACE[4], paddingVertical: SPACE[3] },
  backText:  { fontSize: FONT_SIZE.base, fontWeight: '600' },
  header:    { paddingHorizontal: SPACE[5], paddingTop: SPACE[2] },
  title:     { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 4 },
  subtitle:  { fontSize: FONT_SIZE.sm, fontWeight: '500' },
});
