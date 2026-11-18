import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Badge } from '../components/Badge';
import { getSubjectInfo, getContentTypeInfo } from '../constants/postConstants';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

export const PostDetailsScreen = ({ route, navigation }) => {
  const { id, post: initialPost } = route.params || {};
  const { user } = useAuth();

  const [post, setPost] = useState(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState((initialPost && initialPost.comments) || []);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const data = await postService.getPostById(id);
        setPost(data);
        if (data.comments) setComments(data.comments);
      } catch (error) {
        console.warn('Erro ao carregar detalhes do post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Atenção', 'Digite uma mensagem para o comentário.');
      return;
    }

    setSubmittingComment(true);
    try {
      const newComment = await postService.addComment(post.id, {
        author: (user && user.name) || 'Estudante',
        text: commentText.trim(),
      });
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando conteúdo da aula...</Text>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text style={styles.errorTitle}>Post não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const subject = getSubjectInfo(post.subject);
  const contentType = getContentTypeInfo(post.contentType);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIconBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {subject.label}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Badges */}
          <View style={styles.badgesRow}>
            <Badge label={subject.label} color={subject.color} />
            <Badge
              label={contentType.label}
              color={COLORS.textSecondary}
              bgColor={COLORS.background}
              style={{ marginLeft: 8 }}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{post.title}</Text>

          {/* Author metadata */}
          <View style={styles.authorCard}>
            <View style={styles.authorAvatar}>
              <Ionicons name="person" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.authorName}>{post.author || 'Docente EduBlog'}</Text>
              <Text style={styles.publishDate}>Publicado recentemente</Text>
            </View>
          </View>

          {/* Description box */}
          {post.description ? (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{post.description}</Text>
            </View>
          ) : null}

          {/* Full Content */}
          <View style={styles.contentSection}>
            <Text style={styles.contentText}>{post.content}</Text>
          </View>

          {/* Comments Section (Requisito 2) */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Ionicons name="chatbubbles-outline" size={20} color={COLORS.primary} />
              <Text style={styles.commentsTitle}>
                Comentários ({comments.length})
              </Text>
            </View>

            {/* List of comments */}
            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>
                Seja o primeiro a deixar uma dúvida ou comentário!
              </Text>
            ) : (
              comments.map((c, index) => (
                <View key={c.id || index} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{c.author || 'Estudante'}</Text>
                  </View>
                  <Text style={styles.commentBody}>{c.text}</Text>
                </View>
              ))
            )}

            {/* Add Comment Input */}
            <View style={styles.newCommentBox}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escreva sua dúvida ou comentário..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!commentText.trim() || submittingComment) && styles.sendButtonDisabled,
                ]}
                onPress={handleAddComment}
                disabled={!commentText.trim() || submittingComment}
                activeOpacity={0.8}
              >
                {submittingComment ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                    <Text style={styles.sendButtonText}>Enviar Comentário</Text>
                  </>
                )}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  backIconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
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
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 16,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  publishDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  descriptionBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  contentSection: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contentText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },
  commentsSection: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  noCommentsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  commentBody: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  newCommentBox: {
    marginTop: 8,
  },
  commentInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
