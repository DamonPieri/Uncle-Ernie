// ─── Stop Reveal Screen ────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, TouchableOpacity, StyleSheet,
  useColorScheme, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { DARK, LIGHT, FONT_SIZE, SPACE, RADIUS, BRAND } from '@/constants/theme';
import { LINE_COLORS, LINE_DARK_TEXT } from '@/constants/theme';
import { getRandomStop } from '@/constants/subway';
import { useSubwayStore } from '@/store/subway';

// ─── Split-Flap Tile ──────────────────────────────────────────────────────────
function FlapTile({ char, delay }: { char: string; delay: number }) {
  const [displayed, setDisplayed] = useState('·');
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·- ';

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < CHARS.length) {
        setDisplayed(CHARS[Math.floor(Math.random() * CHARS.length)]);
        idx++;
      } else {
        setDisplayed(char === ' ' ? ' ' : char.toUpperCase());
        clearInterval(interval);
      }
    }, 40);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayed(char === ' ' ? ' ' : char.toUpperCase());
    }, delay + 600);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [char, delay]);

  if (char === ' ') return <View style={styles.flapSpace} />;

  return (
    <View style={styles.flapTile}>
      <Text style={styles.flapChar}>{displayed}</Text>
      <View style={styles.flapDivider} />
    </View>
  );
}

// ─── Stop Name rendered as flap rows ─────────────────────────────────────────
function SplitFlapDisplay({ name }: { name: string }) {
  const words = name.toUpperCase().split(' ');
  return (
    <View style={styles.splitFlapContainer}>
      {words.map((word, wi) => (
        <View key={wi} style={styles.flapRow}>
          {word.split('').map((char, ci) => (
            <FlapTile
              key={`${wi}-${ci}`}
              char={char}
              delay={(wi * word.length + ci) * 60}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RevealScreen() {
  const router = useRouter();
  const cs     = useColorScheme();
  const t      = cs === 'dark' ? DARK : LIGHT;
  const { selectedLine, currentStop, setCurrentStop } = useSubwayStore();

  const lineColor = selectedLine ? (LINE_COLORS[selectedLine] ?? BRAND.blue) : BRAND.blue;
  const lineLabelDark = selectedLine ? LINE_DARK_TEXT.has(selectedLine) : false;

  function reroll() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const stop = getRandomStop(selectedLine ?? undefined);
    setCurrentStop(stop);
  }

  function goExplore() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/explore' as any);
  }

  if (!currentStop) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bgPhone }]}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: t.textSecondary }]}>← Lines</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Line Badge */}
        <View style={[styles.lineBadge, { backgroundColor: lineColor }]}>
          <Text style={[styles.lineBadgeText, { color: lineLabelDark ? '#1A1A1A' : '#fff' }]}>
            {selectedLine ?? '?'}
          </Text>
        </View>

        <Text style={[styles.revealLabel, { color: t.textTertiary }]}>YOUR STOP IS…</Text>

        {/* Split-Flap */}
        <SplitFlapDisplay name={currentStop.name} />

        {/* Meta */}
        <Text style={styles.neighborhood}>
          {currentStop.neighborhood} · {currentStop.borough}
        </Text>
        <View style={styles.linePill}>
          <Text style={styles.linePillText}>
            {currentStop.lines.join(' · ')} Train
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.rerollBtn]}
          onPress={reroll}
          activeOpacity={0.88}
        >
          <Text style={styles.rerollEmoji}>🪙</Text>
          <Text style={styles.rerollText}>Roll again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.letsGoBtn, { backgroundColor: BRAND.blue }]}
          onPress={goExplore}
          activeOpacity={0.88}
        >
          <Text style={styles.letsGoText}>Let's go →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1 },
  backBtn:           { paddingHorizontal: SPACE[6], paddingTop: SPACE[4] },
  backText:          { fontSize: FONT_SIZE.base, fontWeight: '600' },
  content:           { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACE[6] },
  lineBadge:         { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  lineBadgeText:     { fontSize: 18, fontWeight: '900' },
  revealLabel:       { fontSize: FONT_SIZE.xs, fontWeight: '700', letterSpacing: 3, marginBottom: SPACE[5] },
  splitFlapContainer:{ backgroundColor: '#0D0D0D', borderRadius: RADIUS['2xl'], padding: SPACE[6], width: '100%', alignItems: 'center', gap: 6, marginBottom: SPACE[5] },
  flapRow:           { flexDirection: 'row', gap: 4, justifyContent: 'center' },
  flapTile:          { backgroundColor: '#1E1E1E', borderRadius: 6, width: 30, height: 42, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  flapChar:          { fontSize: 22, fontWeight: '900', color: '#F5F0E8' },
  flapDivider:       { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  flapSpace:         { width: 14 },
  neighborhood:      { fontSize: FONT_SIZE.sm, fontWeight: '600', color: 'rgba(245,240,232,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  linePill:          { backgroundColor: 'rgba(0,57,166,0.3)', borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3 },
  linePillText:      { fontSize: FONT_SIZE.xs, fontWeight: '700', color: '#6B9AFF', letterSpacing: 1 },
  actions:           { paddingHorizontal: SPACE[6], paddingBottom: SPACE[6], gap: 12 },
  rerollBtn:         { backgroundColor: BRAND.green, borderRadius: RADIUS.lg, padding: SPACE[4], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  rerollEmoji:       { fontSize: 18 },
  rerollText:        { fontSize: FONT_SIZE.md, fontWeight: '700', color: '#fff' },
  letsGoBtn:         { borderRadius: RADIUS.lg, padding: SPACE[4], alignItems: 'center', justifyContent: 'center' },
  letsGoText:        { fontSize: FONT_SIZE.lg, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
});
