import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ImageSlider } from '../../components/auth/ImageSlider';
import { validation } from '../../utils/validation';

// Import dancer images
const dancerImages = [
  require('../../assets/images/dancers/dancer1.png'),
  require('../../assets/images/dancers/dancer2.png'),
  require('../../assets/images/dancers/dancer3.png'),
];

export const LoginScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Validate inputs
    const emailErr = validation.getEmailError(email);
    const passwordErr = validation.getPasswordError(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password, rememberMe });
      // Navigation will be handled by AuthContext/AppNavigator
    } catch (error: any) {
      Alert.alert(
        'Error de Autenticación',
        error.message || 'Email o contraseña incorrectos',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    Alert.alert(
      'Recuperar Contraseña',
      'Esta funcionalidad estará disponible próximamente.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        // 'padding' suele ser el único que no rompe la web
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ImageSlider images={dancerImages} />

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.colors.surface,
                borderTopLeftRadius: theme.borderRadius['2xl'],
                borderTopRightRadius: theme.borderRadius['2xl'],
                // Agregamos un minHeight explícito para web
                minHeight: Platform.OS === 'web' ? 500 : '65%',
              },
            ]}
          >
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.colors.textPrimary,
                    // CORRECCIÓN AQUÍ: Asegúrate de que sea un string o número directo
                    fontWeight: 'bold'
                  },
                ]}
              >
                Bienvenido a DanceFlow
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Inicia sesión para continuar
              </Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Email
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: emailError
                      ? theme.colors.error
                      : theme.colors.border,
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <RNTextInput
                  style={[
                    styles.input,
                    { color: theme.colors.textPrimary },
                  ]}
                  placeholder="tu@email.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {emailError && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {emailError}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Contraseña
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: passwordError
                      ? theme.colors.error
                      : theme.colors.border,
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <RNTextInput
                  style={[
                    styles.input,
                    { color: theme.colors.textPrimary },
                  ]}
                  placeholder="Tu contraseña"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(null);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {passwordError}
                </Text>
              )}
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: rememberMe
                        ? theme.colors.primary
                        : 'transparent',
                    },
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.checkboxLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Recordar por 30 días
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
                  Olvidé mi contraseña
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.md,
                },
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formCard: {
    marginTop: -30, // Overlap the slider
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: '65%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
