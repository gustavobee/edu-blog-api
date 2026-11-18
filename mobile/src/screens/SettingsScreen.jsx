import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

export const SettingsScreen = ({ navigation }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    Alert.alert('Sessão Encerrada', 'Você saiu da sua conta.', [
      { text: 'OK', onPress: () => navigation.navigate('FeedTab') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações & Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card do Usuário */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <View style={styles.avatarCircle}>
              <Ionicons
                name={user?.role === 'Professor' ? 'school' : 'person'}
                size={32}
                color={COLORS.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.userName}>{user?.name || 'Visitante'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'Sem e-mail'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Perfil: {user?.role || 'Aluno'}</Text>
              </View>
            </View>
          </View>

          {/* Permissões */}
          <View style={styles.permissionsBox}>
            <Text style={styles.permissionsTitle}>Permissões Ativas no App:</Text>
            <View style={styles.permItem}>
              <Ionicons
                name={user?.permissions?.canCreatePost ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={user?.permissions?.canCreatePost ? COLORS.success : COLORS.textMuted}
              />
              <Text style={styles.permText}>Criar e editar postagens</Text>
            </View>
            <View style={styles.permItem}>
              <Ionicons
                name={user?.permissions?.canManageTeachers ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={user?.permissions?.canManageTeachers ? COLORS.success : COLORS.textMuted}
              />
              <Text style={styles.permText}>Gerenciar professores</Text>
            </View>
            <View style={styles.permItem}>
              <Ionicons
                name={user?.permissions?.canManageStudents ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={user?.permissions?.canManageStudents ? COLORS.success : COLORS.textMuted}
              />
              <Text style={styles.permText}>Gerenciar alunos</Text>
            </View>
            <View style={styles.permItem}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.success}
              />
              <Text style={styles.permText}>Visualizar aulas e comentar</Text>
            </View>
          </View>

          {isAuthenticated ? (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
              <Text style={styles.logoutBtnText}>Encerrar Sessão</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
              <Text style={styles.loginBtnText}>Entrar como Professor</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  permissionsBox: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  permissionsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  permItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  permText: {
    fontSize: 13,
    color: COLORS.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerLight,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
