import SubscriptionCard from "@/components/SubscriptionCard";
import "@/global.css";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const posthog = usePostHog();
    const { subscriptions } = useSubscriptionStore();

    useEffect(() => {
        posthog?.capture("subscriptions_page_viewed");
    }, [posthog]);

    const handleSubscriptionPress = (item: Subscription) => {
        const isExpanding = expandedSubscriptionId !== item.id;
        setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id));
        posthog?.capture(isExpanding ? "subscription_expanded" : "subscription_collapsed", {
            subscription_name: item.name,
            subscription_id: item.id,
        });
    };

    const filteredSubscriptions = useMemo(() => {
        if (!searchQuery.trim()) return subscriptions;

        const query = searchQuery.toLowerCase();
        return subscriptions.filter((sub) =>
            sub.name.toLowerCase().includes(query) ||
            sub.category?.toLowerCase().includes(query) ||
            sub.plan?.toLowerCase().includes(query)
        );
    }, [searchQuery, subscriptions]);

    const handleClearSearch = () => {
        setSearchQuery("");
        posthog?.capture("subscription_search_cleared");
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    removeClippedSubviews={false}  // 👈 这个是关键！
                    ListHeaderComponent={
                        <View className="pt-5 pb-3">
                            <Text className="text-2xl font-bold text-text mb-4">All Subscriptions</Text>
                            <View className="relative">
                                <TextInput
                                    className="auth-input"
                                    placeholder="Search subscriptions..."
                                    placeholderTextColor="#999"
                                    value={searchQuery}
                                    onChangeText={(text) => {
                                        setSearchQuery(text);
                                        if (text.trim()) {
                                            posthog?.capture("subscription_search", {
                                                search_query: text
                                            });
                                        }
                                    }}
                                />
                                {searchQuery ? (
                                    <Pressable
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        onPress={handleClearSearch}
                                    >
                                        <Text className="text-lg text-text-secondary">✕</Text>
                                    </Pressable>
                                ) : null}
                            </View>
                        </View>
                    }
                    data={filteredSubscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SubscriptionCard
                            {...item}
                            expanded={expandedSubscriptionId === item.id}
                            onPress={() => handleSubscriptionPress(item)}
                        />
                    )}
                    extraData={expandedSubscriptionId}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text className="home-empty-state">No subscriptions found.</Text>}
                    contentContainerClassName="pb-30 px-5"
                    scrollEnabled={true}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Subscriptions;