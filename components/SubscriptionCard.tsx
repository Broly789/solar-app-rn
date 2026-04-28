import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from '@/lib/utils'
import clsx from 'clsx'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'

const SubscriptionCard = ({ name, price, icon, category, plan, startDate, status, renewalDate, paymentMethod, color, currency, billing, expanded, onPress, ...props }: SubscriptionCardProps) => {
    return (
        <Pressable className={clsx('sub-card',
            expanded ? 'sub-card-expanded' : 'bg-card'
        )} style={!expanded && color ? { backgroundColor: color } : {}} onPress={onPress}>
            <View className='sub-head'>
                <View className='sub-main'>
                    <Image source={icon} className='sub-icon' resizeMode='contain' />
                    <View className='sub-copy'>
                        <Text numberOfLines={1} className='sub-title'>{name}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' className='sub-meta'>{
                            category?.trim() || plan?.trim() || (renewalDate && formatSubscriptionDateTime(renewalDate))}</Text>
                    </View>
                </View>
                <View className="sub-price">
                    <Text className='sub-price'>{formatCurrency(price, currency)}</Text>
                    <Text className='sub-billing'>{billing}</Text>
                </View>
            </View>
            {expanded && (
                <View className='sub-bdy'>
                    <View className='sub-details'>
                        <View className='sub-row'>
                            <View className="sub-row-copy">
                                <Text className='sub-label'>Payment:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{paymentMethod?.trim()}</Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className="sub-row-copy">
                                <Text className='sub-label'>Category:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{category?.trim() || plan?.trim() || 'N/A'}</Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className="sub-row-copy">
                                <Text className='sub-label'>Start Date:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{startDate ? formatSubscriptionDateTime(startDate) : ''}</Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className="sub-row-copy">
                                <Text className='sub-label'>Renewal Date:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{renewalDate ? formatSubscriptionDateTime(renewalDate) : ''}</Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className="sub-row-copy">
                                <Text className='sub-label'>Status:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail'>{status ? formatStatusLabel(status) : ''}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </Pressable>
    )
}

export default SubscriptionCard
