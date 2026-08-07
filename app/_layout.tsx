import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="reveal" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="explore" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="trip/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}
