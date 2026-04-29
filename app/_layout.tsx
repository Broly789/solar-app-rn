import "@/global.css";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

// Prevent the splash screen from auto-hiding before fonts load
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function RootLayoutContent() {
  const [fontLoaded, fontError] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  });

  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!fontLoaded && !fontError) {
      return;
    }
    SplashScreen.hideAsync();
  }, [fontLoaded, fontError]);

  if (fontError) {
    console.error('Font loading error:', fontError);
  }

  if (!fontLoaded || !isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{ headerShown: false }}
    />
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootLayoutContent />
    </ClerkProvider>
  );
}
