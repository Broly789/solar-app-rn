import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontLoaded, fontError] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  });

  useEffect(() => {
    if (!fontLoaded && !fontError) {
      return;
    }
    SplashScreen.hideAsync(); // Hide the splash screen after fonts are loaded or if there's an error
  }, [fontLoaded, fontError]);

  if (fontError) {
    console.error('Font loading error:', fontError);
    // Proceed to render the app UI instead of leaving a blank screen
  }

  if (!fontLoaded && !fontError) {
    return null; // Handle the case where fonts are not loaded and no error
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
