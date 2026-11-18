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
import { teacherService } from '../services/teacherService';

export const TeacherFormScreen = ({ route, navigation }) => {
  const { teacher: editingTeacher } = route.params || {};
  const isEditing = !!editingTeacher;

  const [name, setName] = useState(editingTeacher?.name || '');
  const [email, setEmail] = useState(editingTeacher?.email || '');
  const [subject, setSubject] = useState(editingTeacher?.subject || '');
  const [registration, setRegistration] = useState(
    editingTeacher?.registration || `DOC-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [bio, setBio] = useState(editingTeacher?.bio || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validação', 'Por favor, informe o nome completo do docente.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validação', 'Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setSubmitting(true);
    const teacherPayload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || 'Geral',
      registration: registration.trim(),
      bio: bio.trim(),
    };

    try {
      if (isEditing) {
        await teacherService.updateTeacher(editingTeacher.id, teacherPayload);
        if (Platform.OS === 'web') {
          navigation.goBack();
        } else {
          Alert.alert('Sucesso', 'Dados do docente atualizados com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } else {
        await teacherService.createTeacher(teacherPayload);
        if (Platform.OS === 'web') {
          navigation.goBack();
        } else {
          Alert.alert('Sucesso', 'Novo docente cadastrado com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar docente:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados do docente.');
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
            {isEditing ? 'Editar Docente' : 'Cadastrar Docente'}
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
              Nome Completo <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Prof. Dr. Carlos Eduardo Silva"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* E-mail */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              E-mail Institucional <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: carlos.silva@edublog.fiap.com.br"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Disciplina */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Disciplina / Departamento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Matemática, Física, Biologia Molecular"
              placeholderTextColor={COLORS.textMuted}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          {/* Matrícula */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Número de Matrícula (ID)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: DOC-2026-88"
              placeholderTextColor={COLORS.textMuted}
              value={registration}
              onChangeText={setRegistration}
            />
          </View>

          {/* Biografia / Resumo Acadêmico */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Biografia / Resumo Acadêmico</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Breve formação acadêmica, especializações ou temas de pesquisa..."
              placeholderTextColor={COLORS.textMuted}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
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
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Professor'}
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: COLORS.primary,
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
