import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { studentService } from '../services/studentService';

export const StudentFormScreen = ({ route, navigation }) => {
  const { student: editingStudent } = route.params || {};
  const isEditing = !!editingStudent;

  const [name, setName] = useState(editingStudent?.name || '');
  const [email, setEmail] = useState(editingStudent?.email || '');
  const [grade, setGrade] = useState(editingStudent?.grade || '3º Ano EM - Turma A');
  const [registration, setRegistration] = useState(
    editingStudent?.registration || `ALU-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validação', 'Por favor, informe o nome completo do estudante.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validação', 'Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setSubmitting(true);
    const studentPayload = {
      name: name.trim(),
      email: email.trim(),
      grade: grade.trim(),
      registration: registration.trim(),
    };

    try {
      if (isEditing) {
        await studentService.updateStudent(editingStudent.id, studentPayload);
        if (Platform.OS === 'web') {
          navigation.goBack();
        } else {
          Alert.alert('Sucesso', 'Dados do aluno atualizados com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } else {
        await studentService.createStudent(studentPayload);
        if (Platform.OS === 'web') {
          navigation.goBack();
        } else {
          Alert.alert('Sucesso', 'Novo estudante matriculado com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar estudante:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados do estudante.');
    } finally {
      setSubmitting(false);
    }
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
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar Aluno' : 'Matricular Novo Aluno'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Nome */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Nome Completo do Aluno <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mariana Ferreira Rocha"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* E-mail */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              E-mail do Aluno <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: mariana.rocha@aluno.fiap.com.br"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Turma / Série */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Turma / Série</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 3º Ano EM - Turma B"
              placeholderTextColor={COLORS.textMuted}
              value={grade}
              onChangeText={setGrade}
            />
          </View>

          {/* Matrícula */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Número de Matrícula (ID)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: ALU-2026-90"
              placeholderTextColor={COLORS.textMuted}
              value={registration}
              onChangeText={setRegistration}
            />
          </View>

          {/* Botão de salvar */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name={isEditing ? 'save-outline' : 'checkmark-circle-outline'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.submitButtonText}>
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                </Text>
              </>
            )}
          </TouchableOpacity>
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
    backgroundColor: COLORS.surface,
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: COLORS.danger,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
