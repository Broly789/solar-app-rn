import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import "@/global.css";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// 固定配置
const BAR_COUNT = 7;
const BAR_WIDTH = 14;

export default function Insights() {
    const { subscriptions } = useSubscriptionStore();
    const posthog = usePostHog();
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const [tooltipWidth, setTooltipWidth] = useState(0);


    // 自动获取容器宽度
    const [containerWidth, setContainerWidth] = useState(0);

    const chartData = [
        { value: 38, label: "Mon", frontColor: "#1F2937" },
        { value: 32, label: "Tue", frontColor: "#1F2937" },
        { value: 20, label: "Wed", frontColor: "#1F2937" },
        { value: 42, label: "Thr", frontColor: "#EA7A53" },
        { value: 35, label: "Fri", frontColor: "#1F2937" },
        { value: 18, label: "Sat", frontColor: "#1F2937" },
        { value: 15, label: "Sun", frontColor: "#1F2937" },
    ];

    // ✅ 修复：正确的 spacing 计算公式
    const spacing = containerWidth
        ? (containerWidth - BAR_COUNT * BAR_WIDTH) / (BAR_COUNT + 1)
        : 0;


    const ListHeaderComponent = () => (
        <>
            <View className="auth-content">
                <View className="flex-row items-center justify-between">
                    <Pressable className="w-10 h-10 rounded-full bg-card items-center justify-center">
                        <Text className="text-xl font-bold">←</Text>
                    </Pressable>
                    <Text className="text-2xl font-sans-bold text-primary">Monthly Insights</Text>
                    <Pressable className="w-10 h-10 rounded-full bg-card items-center justify-center">
                        <Text className="text-xl">⋯</Text>
                    </Pressable>
                </View>
            </View>
            <View className="space-y-6 flex-col box-border">
                <ListHeading title="Upcoming" />

                <View className="bg-amber-100 rounded-2xl pr-3 py-3 box-border">
                    {/* ✅ 修复：用 style={{ height: 180 }} 代替无效的 h-180 */}
                    <View
                        className="overflow-hidden"
                        onLayout={(e) => {
                            setContainerWidth(e.nativeEvent.layout.width - 30);
                        }}
                    >
                        {/* 只有获取到宽度才渲染图表 */}
                        {containerWidth > 0 && spacing > 0 && (
                            <BarChart
                                data={chartData}
                                width={containerWidth}
                                height={180}

                                barWidth={BAR_WIDTH}
                                spacing={spacing}
                                initialSpacing={spacing}
                                endSpacing={spacing}

                                barBorderRadius={8}
                                noOfSections={5}

                                yAxisThickness={0}
                                xAxisThickness={0}

                                rulesType="dashed"
                                rulesColor="#D1D5DB"

                                xAxisLabelTextStyle={{
                                    fontSize: 11,
                                    color: "#081126",
                                    fontWeight: "600",
                                    fontFamily: "sans-bold"
                                }}
                                yAxisTextStyle={{
                                    fontSize: 11,
                                    color: "#081126",
                                    fontWeight: "600",
                                    fontFamily: "sans-bold"
                                }}

                                renderTooltip={(item: any) => (
                                    <View onLayout={(e) => {
                                        // 动态测量 Tooltip 宽度
                                        setTooltipWidth(e.nativeEvent.layout.width);
                                    }} className={`bg-white px-2 py-1 rounded-lg transform`} style={{
                                        transform: [{ translateX: tooltipWidth > 0 ? -(tooltipWidth - BAR_WIDTH) / 2 : 0 }],
                                    }}>
                                        <Text className="text-accent text-sm font-bold">${item.value}</Text>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
                {subscriptions.length > 0 && (
                    <View className="mt-5">
                        <SubscriptionCard {...subscriptions[0]} color="transparent" isIcon={false} expanded={false} onPress={() => { }} />
                    </View>
                )}
            </View>
            <ListHeading title="History" />
        </>)

    return (
        <SafeAreaView className="flex-1 bg-background">

            <FlatList
                ListHeaderComponent={ListHeaderComponent}
                contentContainerClassName="pb-30 px-5"
                data={subscriptions}
                ItemSeparatorComponent={() => <View className="h-4" />}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        extraClass={'rounded-tl-none rounded-br-none rounded-tr-3xl rounded-bl-3xl'}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => setExpandedSubscriptionId(prev => prev === item.id ? null : item.id)}
                    />
                )}
            />
        </SafeAreaView>
    );
}