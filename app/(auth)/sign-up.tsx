import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [resendCountdown, setResendCountdown] = React.useState(0);

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) {
      await signUp.verifications.sendEmailCode();
      startResendCountdown();
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    try {
      await signUp.verifications.sendEmailCode();
      startResendCountdown();
    } catch (error) {
      console.error("Failed to resend code:", error);
    }
  };

  const startResendCountdown = () => {
    setResendCountdown(60);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
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

          <Text className="auth-title text-center">Create an account</Text>
          <Text className="auth-subtitle">
            Start managing your subscriptions smarter
          </Text>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className="auth-input"
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  keyboardType="email-address"
                />
                {errors.fields.emailAddress && (
                  <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className="auth-input"
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
                {errors.fields.password && (
                  <Text className="auth-error">{errors.fields.password.message}</Text>
                )}
              </View>

              <Pressable
                className={`auth-button ${(!emailAddress || !password || fetchStatus === "fetching")
                  ? "auth-button-disabled"
                  : ""
                  }`}
                onPress={handleSubmit}
                disabled={!emailAddress || !password || fetchStatus === "fetching"}
              >
                <Text className="auth-button-text">Create an account</Text>
              </Pressable>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Already have an account? </Text>
                <Link href="/sign-in">
                  <Text className="auth-link">Sign in</Text>
                </Link>
              </View>

              <View nativeID="clerk-captcha" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

