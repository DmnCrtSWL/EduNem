import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { authenticate } from '../../data/mockAuth';
import Icon from '../ui/Icon';
import { lightTheme } from '../../theme/tokens';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusedUser, setIsFocusedUser] = useState(false);
  const [isFocusedPass, setIsFocusedPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('edunem_saved_creds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.password) {
          setUsername(parsed.username);
          setPassword(parsed.password);
          setRememberMe(true);
        }
      }
    } catch (e) {
      console.log('No saved credentials');
    }
  }, []);

  const handleSubmit = () => {
    setError('');
    
    if (!username || !password) {
      setError('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user = authenticate(username, password);
      if (user) {
        if (Platform.OS === 'web') {
          if (rememberMe) {
            localStorage.setItem('edunem_saved_creds', JSON.stringify({ username, password }));
          } else {
            localStorage.removeItem('edunem_saved_creds');
          }
        }
        onLogin(user);
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Logo Badge */}
          <View style={styles.logoBadge}>
            <Text style={{ fontSize: 50, lineHeight: 60 }}>🍎</Text>
          </View>

          <Text style={styles.title}>EduNEM</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>USUARIO</Text>
            <TextInput
              style={[
                styles.input,
                isFocusedUser && styles.inputFocused
              ]}
              value={username}
              onChangeText={text => {
                setUsername(text);
                if (error) setError('');
              }}
              placeholder="Ej. docente"
              placeholderTextColor={lightTheme.inputPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsFocusedUser(true)}
              onBlur={() => setIsFocusedUser(false)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={[
                styles.input,
                isFocusedPass && styles.inputFocused
              ]}
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (error) setError('');
              }}
              placeholder="••••••••"
              placeholderTextColor={lightTheme.inputPlaceholder}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsFocusedPass(true)}
              onBlur={() => setIsFocusedPass(false)}
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            activeOpacity={0.7}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Icon name="check" size={12} color="#ffffff" />}
            </View>
            <Text style={styles.checkboxLabel}>Recordarme</Text>
          </TouchableOpacity>

          {Boolean(error) && (
            <View style={styles.errorContainer}>
              <Icon name="alert-triangle" size={16} color={lightTheme.colorDanger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#eff6ff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 'max(env(safe-area-inset-top), 24px)',
    paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  logoBadge: {
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 28,
    textAlign: 'center',
  },
  formGroup: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
  },
  inputFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
  submitButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  footerText: {
    marginTop: 28,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: -8,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
});
