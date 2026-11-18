import React, { useState, useEffect } from 'react';
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
import { SUBJECTS, CONTENT_TYPES, STATUSES } from '../constants/postConstants';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

export const PostFormScreen = ({ route, navigation }) => {
  const { post: editingPost } = route.params || {};
  const { user } = useAuth();
  const isEditing = !!editingPost;

  const [title, setTitle] = useState(editingPost?.title || '');
  const [description, setDescription] = useState(editingPost?.description || '');
  const [content, setContent] = useState(editingPost?.content || '');
  const [author, setAuthor] = useState(editingPost?.author || user?.name || 'Docente EduBlog');
  const [subject, setSubject] = useState(editingPost?.subject || 'matematica');
  const [contentType, setContentType] = useState(editingPost?.contentType || 'aula_teorica');
  const [status, setStatus] = useState(editingPost?.status || 'publicado');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validação', 'Por favor, informe o título da postagem.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Validação', 'Por favor, escreva o conteúdo da postagem.');
      return;
    }
    if (!author.trim()) {
      Alert.alert('Validação', 'Por favor, informe o nome do autor.');
      return;
    }

    setSubmitting(true);
    const postPayload = {
      title: title.trim(),
      description: description.trim() || title.trim(),
      content: content.trim(),
      author: author.trim(),
      subject,
      contentType,
      status,
    };

    try {
      if (isEditing) {
        await postService.updatePost(editingPost.id, postPayload);
        if (Platform.OS === 'web') {
          navigation.goBack();
        } else {
          Alert.alert('Sucesso', 'Postagem atualizada com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } else {
        await postService.createPost(postPayload);
        if (Platform.OS === 'web') {
          navigation.goBack();
        } else {
          Alert.alert('Sucesso', 'Postagem publicada com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar postagem:', error);
      Alert.alert('Erro', 'Não foi possível salvar a postagem. Tente novamente.');
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
            {isEditing ? 'Editar Postagem' : 'Nova Postagem'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Título */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Título da Postagem <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Introdução às Funções Trigonométricas"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Breve Descrição */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Resumo / Breve Descrição</Text>
            <TextInput
              style={[styles.input, styles.inputMultilineSmall]}
              placeholder="Breve resumo do conteúdo que aparecerá no feed..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Autor */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Autor / Docente <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do professor responsável"
              placeholderTextColor={COLORS.textMuted}
              value={author}
              onChangeText={setAuthor}
            />
          </View>

          {/* Disciplina */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Disciplina</Text>
            <View style={styles.pillsContainer}>
              {SUBJECTS.map((sub) => {
                const isSelected = subject === sub.value;
                return (
                  <TouchableOpacity
                    key={sub.value}
                    style={[
                      styles.pill,
                      isSelected && { backgroundColor: sub.color, borderColor: sub.color },
                    ]}
                    onPress={() => setSubject(sub.value)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextActive,
                      ]}
                    >
                      {sub.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Tipo de Conteúdo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Conteúdo</Text>
            <View style={styles.pillsContainer}>
              {CONTENT_TYPES.map((type) => {
                const isSelected = contentType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.pill,
                      isSelected && styles.pillSelectedPrimary,
                    ]}
                    onPress={() => setContentType(type.value)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Status */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Status da Postagem</Text>
            <View style={styles.pillsContainer}>
              {STATUSES.map((st) => {
                const isSelected = status === st.value;
                return (
                  <TouchableOpacity
                    key={st.value}
                    style={[
                      styles.pill,
                      isSelected && { backgroundColor: st.color, borderColor: st.color },
                    ]}
                    onPress={() => setStatus(st.value)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        isSelected && styles.pillTextActive,
                      ]}
                    >
                      {st.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Conteúdo Completo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Conteúdo Completo da Aula <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.inputMultilineLarge]}
              placeholder="Escreva aqui o material didático, explicações, fórmulas ou orientações..."
              placeholderTextColor={COLORS.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Botão de Envio */}
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
                  name={isEditing ? 'save-outline' : 'paper-plane-outline'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.submitButtonText}>
                  {isEditing ? 'Salvar Alterações' : 'Publicar Postagem'}
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
  inputMultilineSmall: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputMultilineLarge: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillSelectedPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
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
