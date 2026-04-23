import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link className="mt-4 rounded bg-primary text-white p-4" href="/onboarding" asChild>
        <Text>onboarding</Text>
      </Link>
      <Link className="mt-4 rounded bg-primary text-white p-4" href="/(auth)/sign-in" asChild>
        <Text>sign-in</Text>
      </Link>
      <Link href="/subscriptions/spotify" className="mt-4 rounded bg-primary text-white p-4" asChild>
        <Text>spotify subscription</Text>
      </Link>
      <Link href={{
        pathname: "/subscriptions/[id]",
        params: { id: "claude" },
      }} className="mt-4 rounded bg-primary text-white p-4" asChild>
        <Text>claude subscription</Text>
      </Link>
    </SafeAreaView>
  );
}
