import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length > 0;
  const formValid = emailAddress.length > 0 && passwordValid && emailValid;

  const handleSubmit = async () => {
    if (!formValid) return;
    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/(tabs)');
          if (url.startsWith('http')) {
            // Only use window.location on web platform
            if (typeof window !== 'undefined' && window.location) {
              window.location.href = url;
            } else {
              // On native, just use router navigation
              router.replace('/(tabs)' as Href);
            }
          } else {
            router.replace(url as Href);
          }
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
        startResendCountdown();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/(tabs)');
          if (url.startsWith('http')) {
            // Only use window.location on web platform
            if (typeof window !== 'undefined' && window.location) {
              window.location.href = url;
            } else {
              // On native, just use router navigation
              router.replace('/(tabs)' as Href);
            }
          } else {
            router.replace(url as Href);
          }
        },
      });
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    try {
      await signIn.mfa.sendEmailCode();
      startResendCountdown();
    } catch (error) {
      console.error("Failed to resend code:", error);
    }
  };

  const startResendCountdown = () => {
    setResendCountdown(60);
  };
  useEffect(() => {
    let interval: any;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  if (signIn.status === "needs_client_trust") {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="auth-scroll">
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark rounded-bl-3xl rounded-tr-3xl">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub pt-1.5">SMART BILLING</Text>
                </View>
              </View>
            </View>

            <Text className="auth-title text-center">Verify your account</Text>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <TextInput
                    className="auth-input"
                    value={code}
                    placeholder="Enter your verification code"
                    placeholderTextColor="#999"
                    onChangeText={(code) => setCode(code)}
                    keyboardType="numeric"
                  />
                  {errors.fields.code && (
                    <Text className="auth-error">{errors.fields.code.message}</Text>
                  )}
                </View>

                <Pressable
                  className={`auth-button ${fetchStatus === "fetching" ? "auth-button-disabled" : ""
                    }`}
                  onPress={handleVerify}
                  disabled={fetchStatus === "fetching"}
                >
                  <Text className="auth-button-text">Verify</Text>
                </Pressable>

                <Pressable
                  className="auth-secondary-button"
                  onPress={handleResendCode}
                  disabled={resendCountdown > 0}
                >
                  <Text className="auth-secondary-button-text">
                    {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "I need a new code"}
                  </Text>
                </Pressable>

                <Pressable
                  className="auth-secondary-button"
                  onPress={() => signIn.reset()}
                >
                  <Text className="auth-secondary-button-text">Start over</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="auth-scroll">
        <View className="auth-content">
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark rounded-bl-3xl rounded-tr-3xl">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub pt-1.5">SMART BILLING</Text>
              </View>
            </View>
          </View>

          <Text className="auth-title text-center">Welcome back</Text>
          <Text className="auth-subtitle">
            Sign in to continue managing your subscriptions
          </Text>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={`auth-input ${emailTouched && (errors.fields.identifier) ? "auth-input-error" : ""}`}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  onBlur={() => setEmailTouched(true)}
                  onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  keyboardType="email-address"
                />
                {emailTouched && !emailValid && (
                  <Text className="auth-error">Please enter a valid email address</Text>
                )}
                {errors.fields.identifier && (
                  <Text className="auth-error">{errors.fields.identifier.message}</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={`auth-input ${passwordTouched && !passwordValid && 'auth-input-error'}`}
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={true}
                  onBlur={() => setPasswordTouched(true)}
                  onChangeText={(password) => setPassword(password)}
                />
                {passwordTouched && !passwordValid && (
                  <Text className="auth-error">Password is required</Text>
                )}
                {errors.fields.password && (
                  <Text className="auth-error">{errors.fields.password.message}</Text>
                )}
              </View>

              <Pressable
                className={`auth-button ${(!formValid || fetchStatus === 'fetching') && 'auth-button-disabled'}`}
                onPress={handleSubmit}
                disabled={!formValid || fetchStatus === 'fetching'}
              >
                <Text className="auth-button-text">
                  {fetchStatus === 'fetching' ? 'Signing In...' : 'Sign In'}
                </Text>
              </Pressable>

              <View className="auth-link-row">
                <Text className="auth-link-copy">New to Recurly? </Text>
                <Link href="/sign-up">
                  <Text className="auth-link">Create an account</Text>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

