// ─── Settings Screen ──────────────────────────────────────────────────────────
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DARK, LIGHT, FONT_SIZE, SPACE } from '@/constants/theme';

export default function SettingsScreen() {
  const cs = useColorScheme();
  const t  = cs === 'dark' ? DARK : LIGHT;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.textPrimary }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: t.textSecondary }]}>Coming in Sprint 5</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header:    { paddingHorizontal: SPACE[5], paddingTop: SPACE[4] },
  title:     { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 4 },
  subtitle:  { fontSize: FONT_SIZE.sm, fontWeight: '500' },
});
