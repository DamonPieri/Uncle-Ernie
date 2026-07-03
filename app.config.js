module.exports = {
  expo: {
    name: "Uncle Ernie",
    slug: "uncle-ernie",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "uncle-ernie",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#141414",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.unclernie.app",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#141414",
      },
      package: "com.unclernie.app",
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          android: { compileSdkVersion: 34 },
          ios: { deploymentTarget: "16.4" },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
