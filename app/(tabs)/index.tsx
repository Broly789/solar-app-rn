import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link className="mt-4 rounded bg-primary text-white p-4" href="/onboarding" asChild>
        <Text>onboarding</Text>
      </Link>;
      <Link className="mt-4 rounded bg-primary text-white p-4" href="/(auth)/sign-in" asChild>
        <Text>sign-in</Text>
      </Link>;
      <Link href="/subscriptions/spotify" className="mt-4 rounded bg-primary text-white p-4" asChild>
        <Text>spotify subscription</Text>
      </Link>;
      <Link href={{
        pathname: "/subscriptions/[id]",
        params: { id: "claude" },
      }} className="mt-4 rounded bg-primary text-white p-4" asChild>
        <Text>claude subscription</Text>
      </Link>;
    </View>
  );
}
