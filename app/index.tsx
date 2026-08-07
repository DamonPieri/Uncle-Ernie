// ─── Home Screen — Line Selection ─────────────────────────────────────────────
import { useRouter } from 'expo-router';
import {
  View, Text, TouchableOpacity,
  StyleSheet, useColorScheme, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { haptic } from '@/hooks/useHaptics';
import { DARK, LIGHT, FONT_SIZE, SPACE, RADIUS, BRAND } from '@/constants/theme';
import { SUBWAY_LINES, getRandomStop } from '@/constants/subway';
import { useSubwayStore } from '@/store/subway';

export default function HomeScreen() {
  const router = useRouter();
  const cs     = useColorScheme();
  const t      = cs === 'dark' ? DARK : LIGHT;
  const { setSelectedLine, setCurrentStop } = useSubwayStore();

  function pickLine(lineId: string) {
    haptic.light();
    setSelectedLine(lineId);
    setCurrentStop(getRandomStop(lineId));
    router.push('/reveal');
  }

  function surpriseMe() {
    haptic.medium();
    setSelectedLine(null);
    setCurrentStop(getRandomStop());
    router.push('/reveal');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
      {/* Top row: Saved */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: t.bgCard }]} onPress={() => router.push('/saved')}>
          <Ionicons name="bookmark-outline" size={20} color={t.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: t.textLabel }]}>Uncle Ernie</Text>
          <Text style={[styles.headline, { color: t.textPrimary }]}>
            Where is Uncle Ernie{'\n'}taking you?
          </Text>
          <Text style={[styles.subline, { color: t.textSecondary }]}>
            Pick a line. Get a stop. Go explore.
          </Text>
        </View>

        {/* Line Grid */}
        <Text style={[styles.sectionLabel, { color: t.textLabel }]}>Choose a line</Text>
        <View style={styles.grid}>
          {SUBWAY_LINES.map((line) => (
            <TouchableOpacity
              key={line.id}
              style={[styles.bubble, { backgroundColor: line.color }]}
              onPress={() => pickLine(line.id)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.bubbleText,
                { color: line.darkText ? '#1A1A1A' : '#fff', fontSize: line.id === 'SIR' ? 10 : 15 },
              ]}>
                {line.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: t.borderInput }]} />
          <Text style={[styles.dividerText, { color: t.textTertiary }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: t.borderInput }]} />
        </View>

        {/* Surprise Me */}
        <TouchableOpacity
          style={[styles.surpriseBtn, { backgroundColor: t.btnPrimaryBg }]}
          onPress={surpriseMe}
          activeOpacity={0.88}
        >
          <FontAwesome5 name="dice" size={22} color={t.btnPrimaryText} />
          <Text style={[styles.surpriseText, { color: t.btnPrimaryText }]}>
            Surprise me, Ernie
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  topBar:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: SPACE[5], paddingTop: SPACE[3], paddingBottom: SPACE[2] },
  iconBtn:      { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  scroll:       { padding: SPACE[6], paddingTop: SPACE[2], paddingBottom: SPACE[8] },
  header:       { marginBottom: SPACE[6] },
  appTitle:     { fontSize: FONT_SIZE.xs, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4 },
  headline:     { fontSize: FONT_SIZE['4xl'], fontWeight: '900', lineHeight: 36, letterSpacing: -0.5, marginBottom: 6 },
  subline:      { fontSize: FONT_SIZE.base, fontWeight: '500' },
  sectionLabel: { fontSize: FONT_SIZE.xs, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACE[6] },
  bubble:       { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  bubbleText:   { fontWeight: '900' },
  dividerRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACE[4] },
  dividerLine:  { flex: 1, height: 1 },
  dividerText:  { fontSize: FONT_SIZE.xs, fontWeight: '600', letterSpacing: 1 },
  surpriseBtn:  { borderRadius: RADIUS.lg, padding: SPACE[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  surpriseText: { fontSize: FONT_SIZE.lg, fontWeight: '800', letterSpacing: -0.2 },
});
