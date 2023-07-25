import React, { useContext, useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { AuthContext } from "../auth/AuthProvider";
import ErrorMessage from "../components/ErrorMessage";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import FloatingMessage from "../components/FloatingMessage";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onLoginPressed = async () => {
    setIsLoading(true);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setIsLoading(false);
      return;
    }

    try {
      await login(email.value, password.value);
    } catch (error) {
      showError("Failed to loggin");
    } finally {
      setIsLoading(false);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [messageType, setMessageType] = useState(0); // error
  const [errorRendererKey, setErrorRendererKey] = useState(0);

  const showError = (text) => {
    setErrorMessage(text);
    setMessageType(0);
    setErrorRendererKey(errorRendererKey + 1);
  };

  const showSuccess = (text) => {
    setErrorMessage(text);
    setMessageType(1);
    setErrorRendererKey(errorRendererKey + 1);
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      {!isLoading ? (
        <Button mode="contained" onPress={onLoginPressed}>
          Login
        </Button>
      ) : (
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      )}
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <FloatingMessage
        message={errorMessage}
        type={messageType}
        rendererKey={errorRendererKey}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  loadingButtonContaine: {},
});
