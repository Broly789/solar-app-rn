import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SignIn = () => {
    return (
        <View>
            <Text> SignIn</Text>
            <Link href="/(auth)/sign-up">
                <Text>Sign Up</Text>
            </Link>
            {/* <Link href="/sign-in">Sign In</Link> */}
        </View>
    )
}

export default SignIn