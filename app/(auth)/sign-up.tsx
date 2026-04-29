import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // 表单校验（和登录页完全一致）
  const emailValid =
    emailAddress.length === 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length >= 6;
  const formValid =
    emailAddress.length > 0 && passwordValid && emailValid;

  // 提交注册
  const handleSubmit = async () => {
    if (!formValid) return;

    const { error } = await signUp.create({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    // 发送邮箱验证码
    await signUp.verifications.sendEmailCode();
    startResendCountdown();
  };

  // 验证邮箱验证码
  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/(tabs)");
          if (url.startsWith("http")) {
            if (typeof window !== "undefined" && window.location) {
              window.location.href = url;
            } else {
              router.replace("/(tabs)" as Href);
            }
          } else {
            router.replace(url as Href);
          }
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  // 重发验证码
  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    try {
      await signUp.verifications.sendEmailCode();
      startResendCountdown();
    } catch (error) {
      console.error("Failed to resend code:", error);
    }
  };

  // 倒计时逻辑
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

  // ------------------------------
  // 邮箱验证界面
  // ------------------------------
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

            <Text className="auth-title text-center">Verify your email</Text>

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
                    <Text className="auth-error">
                      {errors.fields.code.message}
                    </Text>
                  )}
                </View>

                <Pressable
                  className={`auth-button ${fetchStatus === "fetching" ? "auth-button-disabled" : ""
                    }`}
                  onPress={handleVerify}
                  disabled={fetchStatus === "fetching"}
                >
                  <Text className="auth-button-text">Verify & Create Account</Text>
                </Pressable>

                <Pressable
                  className="auth-secondary-button"
                  onPress={handleResendCode}
                  disabled={resendCountdown > 0}
                >
                  <Text className="auth-secondary-button-text">
                    {resendCountdown > 0
                      ? `Resend code in ${resendCountdown}s`
                      : "I need a new code"}
                  </Text>
                </Pressable>

                <Pressable
                  className="auth-secondary-button"
                  onPress={() => signUp.reset()}
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

  // ------------------------------
  // 注册主界面
  // ------------------------------
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

          <Text className="auth-title text-center">Create account</Text>
          <Text className="auth-subtitle text-center">
            Create your account to get started
          </Text>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={`auth-input ${emailTouched && errors.fields.emailAddress
                    ? "auth-input-error"
                    : ""
                    }`}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  onBlur={() => setEmailTouched(true)}
                  onChangeText={(emailAddress) =>
                    setEmailAddress(emailAddress)
                  }
                  keyboardType="email-address"
                />
                {emailTouched && !emailValid && (
                  <Text className="auth-error">
                    Please enter a valid email address
                  </Text>
                )}
                {errors.fields.emailAddress && (
                  <Text className="auth-error">
                    {errors.fields.emailAddress.message}
                  </Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={`auth-input ${passwordTouched && !passwordValid && "auth-input-error"
                    }`}
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={true}
                  onBlur={() => setPasswordTouched(true)}
                  onChangeText={(password) => setPassword(password)}
                />
                {passwordTouched && !passwordValid && (
                  <Text className="auth-error">
                    Password must be at least 6 characters
                  </Text>
                )}
                {errors.fields.password && (
                  <Text className="auth-error">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>

              <Pressable
                className={`auth-button ${(!formValid || fetchStatus === "fetching") &&
                  "auth-button-disabled"
                  }`}
                onPress={handleSubmit}
                disabled={!formValid || fetchStatus === "fetching"}
              >
                <Text className="auth-button-text">
                  {fetchStatus === "fetching"
                    ? "Creating Account..."
                    : "Create Account"}
                </Text>
              </Pressable>

              <View className="auth-link-row">
                <Text className="auth-link-copy">Already have an account? </Text>
                <Link href="/sign-in">
                  <Text className="auth-link">Sign in</Text>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
