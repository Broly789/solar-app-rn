import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-5xl font-sans-extrabold">
        Home
      </Text>
      <Link className="mt-4 font-sans-bold rounded bg-primary text-white p-4" href="/onboarding" asChild>
        <Text>onboarding</Text>
      </Link>
      <Link className="mt-4 font-sans-bold rounded bg-primary text-white p-4" href="/(auth)/sign-in" asChild>
        <Text>sign-in</Text>
      </Link>
      <Link className="mt-4 font-sans-bold rounded bg-primary text-white p-4" href="/(auth)/sign-up" asChild>
        <Text>sign-up</Text>
      </Link>
    </SafeAreaView>
  );
}
