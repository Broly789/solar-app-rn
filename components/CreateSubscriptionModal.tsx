import { icons } from "@/constants/icons";
import "@/global.css";
import clsx from "clsx";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const ScrollViewStyled = styled(ScrollView);

const CATEGORIES = [
    "Entertainment",
    "AI Tools",
    "Developer Tools",
    "Design",
    "Productivity",
    "Cloud",
    "Music",
    "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
    Entertainment: "#FFB6C1",
    "AI Tools": "#87CEEB",
    "Developer Tools": "#DDA0DD",
    Design: "#F0E68C",
    Productivity: "#98FB98",
    Cloud: "#B0E0E6",
    Music: "#FFD700",
    Other: "#D3D3D3",
};

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (subscription: Subscription) => void;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
    visible,
    onClose,
    onSubmit,
}) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
    const [category, setCategory] = useState("Entertainment");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const posthog = usePostHog();
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!price.trim()) {
            newErrors.price = "Price is required";
        } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            newErrors.price = "Price must be a positive number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateId = () => {
        return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const calculateRenewalDate = () => {
        if (frequency === "Monthly") {
            return dayjs().add(1, "month").toISOString();
        } else {
            return dayjs().add(1, "year").toISOString();
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const newSubscription: Subscription = {
            id: generateId(),
            name: name.trim(),
            price: parseFloat(price),
            currency: "USD",
            billing: frequency,
            frequency,
            category,
            status: "active",
            startDate: dayjs().toISOString(),
            renewalDate: calculateRenewalDate(),
            icon: icons.wallet,
            color: CATEGORY_COLORS[category],
        };

        onSubmit(newSubscription);
        posthog.capture("subscription_created", {
            subscription_name: newSubscription.name,
            subscription_id: newSubscription.id,
            category: newSubscription.category!,
            price: newSubscription.price,
            frequency: newSubscription.frequency!,
        });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory("Entertainment");
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const isSubmitDisabled = !name.trim() || !price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0;

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View className="flex-1 bg-black/50">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <View className="modal-container">
                        {/* Header */}
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable
                                className="modal-close"
                                onPress={handleClose}
                            >
                                <Text className="modal-close-text">✕</Text>
                            </Pressable>
                        </View>

                        {/* Body */}
                        <ScrollViewStyled className="modal-body">
                            {/* Name Field */}
                            <View className="auth-field">
                                <Text className="auth-label">Subscription Name</Text>
                                <TextInput
                                    className={clsx("auth-input", errors.name && "auth-input-error")}
                                    placeholder="e.g., Spotify Premium"
                                    placeholderTextColor="#999"
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        if (errors.name) {
                                            setErrors({ ...errors, name: "" });
                                        }
                                    }}
                                />
                                {errors.name && <Text className="auth-error">{errors.name}</Text>}
                            </View>

                            {/* Price Field */}
                            <View className="auth-field">
                                <Text className="auth-label">Monthly/Yearly Price</Text>
                                <TextInput
                                    className={clsx("auth-input", errors.price && "auth-input-error")}
                                    placeholder="0.00"
                                    placeholderTextColor="#999"
                                    keyboardType="decimal-pad"
                                    value={price}
                                    onChangeText={(text) => {
                                        setPrice(text);
                                        if (errors.price) {
                                            setErrors({ ...errors, price: "" });
                                        }
                                    }}
                                />
                                {errors.price && <Text className="auth-error">{errors.price}</Text>}
                            </View>

                            {/* Frequency Picker */}
                            <View className="auth-field">
                                <Text className="auth-label">Billing Frequency</Text>
                                <View className="picker-row">
                                    {(["Monthly", "Yearly"] as const).map((freq) => (
                                        <Pressable
                                            key={freq}
                                            className={clsx(
                                                "picker-option",
                                                frequency === freq && "picker-option-active"
                                            )}
                                            onPress={() => setFrequency(freq)}
                                        >
                                            <Text
                                                className={clsx(
                                                    "picker-option-text",
                                                    frequency === freq && "picker-option-text-active"
                                                )}
                                            >
                                                {freq}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            {/* Category Chips */}
                            <View className="auth-field">
                                <Text className="auth-label">Category</Text>
                                <View className="category-scroll">
                                    {CATEGORIES.map((cat) => (
                                        <Pressable
                                            key={cat}
                                            className={clsx(
                                                "category-chip",
                                                category === cat && "category-chip-active"
                                            )}
                                            onPress={() => setCategory(cat)}
                                        >
                                            <Text
                                                className={clsx(
                                                    "category-chip-text",
                                                    category === cat && "category-chip-text-active"
                                                )}
                                            >
                                                {cat}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            {/* Submit Button */}
                            <Pressable
                                className={clsx(
                                    "auth-button mt-6",
                                    isSubmitDisabled && "auth-button-disabled"
                                )}
                                onPress={handleSubmit}
                                disabled={isSubmitDisabled}
                            >
                                <Text className="auth-button-text">Create Subscription</Text>
                            </Pressable>

                            <View className="h-10" />
                        </ScrollViewStyled>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default CreateSubscriptionModal;
