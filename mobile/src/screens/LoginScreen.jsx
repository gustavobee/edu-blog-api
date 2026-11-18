import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const { login, isAuthenticated, user, logout } = useAuth();

  const [email, setEmail] = useState('professor@fiap.com.br');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Validação', 'Por favor, informe seu e-mail.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Validação', 'Por favor, informe sua senha.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password.trim(), 'Professor');
    setLoading(false);

    if (result.success) {
      if (Platform.OS === 'web') {
        navigation.goBack();
      } else {
        Alert.alert(
          'Bem-vindo(a)!',
          'Autenticado como Professor. Permissões administrativas ativadas.',
          [{ text: 'Avançar', onPress: () => navigation.goBack() }]
        );
      }
    } else {
      Alert.alert('Falha', 'Não foi possível autenticar. Verifique seus dados.');
    }
  };

  const fillTeacherDemo = () => {
    setEmail('professor@fiap.com.br');
    setPassword('senha123');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Autenticação</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Welcome */}
          <View style={styles.heroSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="school" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.heroTitle}>EduBlog Mobile</Text>
            <Text style={styles.heroSubtitle}>
              Entre para gerenciar postagens, professores e turmas de estudantes.
            </Text>
          </View>

          {/* Estado de usuário já conectado */}
          {isAuthenticated && (
            <View style={styles.connectedCard}>
              <View style={styles.connectedRow}>
                <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.connectedTitle}>Sessão Ativa</Text>
                  <Text style={styles.connectedSubtitle}>
                    Conectado como <Text style={{ fontWeight: '700' }}>{user?.name}</Text> ({user?.role})
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={async () => {
                  await logout();
                  Alert.alert('Desconectado', 'Sua sessão foi encerrada.');
                }}
              >
                <Ionicons name="log-out-outline" size={16} color={COLORS.danger} />
                <Text style={styles.logoutBtnText}>Encerrar Sessão</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Perfil de Acesso */}
          <Text style={styles.roleLabel}>Perfil de Acesso:</Text>
          <View style={styles.roleSelector}>
            <View style={[styles.roleOption, styles.roleOptionActive]}>
              <Ionicons
                name="school-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={[styles.roleOptionText, styles.roleOptionTextActive]}>
                Docente / Professor
              </Text>
            </View>
          </View>

          {/* Formulário */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail de Acesso</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="seu.email@fiap.com.br"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="******"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.loginBtnText}>Entrar como Professor</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Botão de Preenchimento Rápido para Avaliação */}
          <View style={styles.quickFillSection}>
            <Text style={styles.quickFillTitle}>⚡ Acesso Rápido para Testes:</Text>
            <View style={styles.quickFillButtons}>
              <TouchableOpacity
                style={styles.quickBtnTeacher}
                onPress={fillTeacherDemo}
              >
                <Text style={styles.quickBtnTeacherText}>Preencher como Professor</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 280,
  },
  connectedCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  connectedSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.danger,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  roleOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  roleOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  roleOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    marginTop: 6,
  },
  loginBtnDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickFillSection: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickFillTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  quickFillButtons: {
    gap: 8,
  },
  quickBtnTeacher: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickBtnTeacherText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quickBtnStudent: {
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickBtnStudentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
});
