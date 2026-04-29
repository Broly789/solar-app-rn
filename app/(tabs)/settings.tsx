import { useClerk } from "@clerk/expo";
import { styled } from "nativewind";
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const Settings = () => {
    const { signOut } = useClerk();

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="settings-container">
                <Text className="settings-title">Settings</Text>
                <Pressable
                    className="settings-button"
                    onPress={async () => {
                        try {
                            await signOut();
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