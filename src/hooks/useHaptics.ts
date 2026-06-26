// Haptics wrapper — no-op until expo-haptics native module is available.
// Swap this out for the real implementation once running on a physical device.
export const haptic = {
  light:     () => {},
  medium:    () => {},
  selection: () => {},
};
