import { Tabs } from 'expo-router';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DARK, LIGHT } from '@/constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ icon, iconFocused, label, focused }: {
  icon: IoniconsName;
  iconFocused: IoniconsName;
  label: string;
  focused: boolean;
}) {
  const cs = useColorScheme();
  const t = cs === 'dark' ? DARK : LIGHT;
  const color = focused ? t.textPrimary : t.textSecondary;
  return (
    <View style={styles.tabItem}>
      <Ionicons name={focused ? iconFocused : icon} size={24} color={color} />
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const cs = useColorScheme();
  const t = cs === 'dark' ? DARK : LIGHT;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.bgTabBar,
          borderTopColor: t.borderTabBar,
          borderTopWidth: 1,
          height: 90,
          paddingTop: 10,
          paddingBottom: 16,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="map-outline" iconFocused="map" label="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="bookmark-outline" iconFocused="bookmark" label="Saved" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="settings-outline" iconFocused="settings" label="Settings" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem:  { alignItems: 'center', gap: 3, minWidth: 70 },
  tabLabel: { fontSize: 8, fontWeight: '600', letterSpacing: 0.2 },
});
