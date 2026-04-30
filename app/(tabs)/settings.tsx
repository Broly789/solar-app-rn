import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native"; // Import the usePostHog hook from the posthog-js/react-native package
import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const Settings = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const posthog = usePostHog()
    useEffect(() => {
        posthog.capture("settings_open")
    }, [posthog])

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="settings-container">
                <Text className="settings-title">Settings</Text>
                <Pressable
                    className="settings-button"
                    onPress={async () => {
                        posthog.capture('user_signed_out', {
                            user_id: user?.id || 'unknown', // Using user ID instead of email for privacy
                        });
                        try {
                            await signOut();
                            posthog.reset();
                        } catch (error) {
                            console.error("Failed to sign out", error);
                        }
                    }}
                >
                    <Text className="settings-button-text">Sign Out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Settings