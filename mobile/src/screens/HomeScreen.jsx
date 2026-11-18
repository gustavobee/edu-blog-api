import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { PostCard } from '../components/PostCard';
import { EmptyState } from '../components/EmptyState';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { SUBJECTS } from '../constants/postConstants';

export const HomeScreen = ({ navigation }) => {
  const { user, isTeacher, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('todos');

  const loadPosts = useCallback(async () => {
    try {
      const data = await postService.getPosts(false);
      setPosts(data);
      applyFilter(data, searchTerm, selectedSubject);
    } catch (error) {
      console.warn('Erro ao carregar posts na Home:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, selectedSubject]);

  useEffect(() => {
    loadPosts();
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const applyFilter = (list, term, subject) => {
    let result = [...list];

    if (term.trim()) {
      const lower = term.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(lower)) ||
          (p.description && p.description.toLowerCase().includes(lower)) ||
          (p.content && p.content.toLowerCase().includes(lower)) ||
          (p.author && p.author.toLowerCase().includes(lower))
      );
    }

    if (subject !== 'todos') {
      result = result.filter((p) => p.subject === subject);
    }

    setFilteredPosts(result);
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    applyFilter(posts, text, selectedSubject);
  };

  const handleSubjectSelect = (subKey) => {
    setSelectedSubject(subKey);
    applyFilter(posts, searchTerm, subKey);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <View style={styles.logoRow}>
            <Ionicons name="school" size={24} color={COLORS.primary} />
            <Text style={styles.logoText}>EduBlog</Text>
          </View>
          <Text style={styles.greetingText}>
            Olá, {user ? user.name : 'Estudante'}! 👋
          </Text>
        </View>

        <TouchableOpacity
          style={styles.profileBadge}
          onPress={() => navigation.navigate(isAuthenticated ? 'Settings' : 'Login')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isAuthenticated ? 'person' : 'log-in-outline'}
            size={18}
            color={COLORS.primary}
          />
          <Text style={styles.profileBadgeText}>
            {isAuthenticated ? user.role : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Busca (Requisito 1) */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por palavra-chave, título, autor..."
            placeholderTextColor={COLORS.textMuted}
            value={searchTerm}
            onChangeText={handleSearchChange}
            clearButtonMode="while-editing"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtro horizontal por Disciplinas */}
      <View style={styles.subjectsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectsScroll}
        >
          <TouchableOpacity
            style={[
              styles.subjectPill,
              selectedSubject === 'todos' && styles.subjectPillActive,
            ]}
            onPress={() => handleSubjectSelect('todos')}
          >
            <Text
              style={[
                styles.subjectPillText,
                selectedSubject === 'todos' && styles.subjectPillTextActive,
              ]}
            >
              Todas as Disciplinas
            </Text>
          </TouchableOpacity>

          {SUBJECTS.map((sub) => {
            const isSelected = selectedSubject === sub.value;
            return (
              <TouchableOpacity
                key={sub.value}
                style={[
                  styles.subjectPill,
                  isSelected && { backgroundColor: sub.color, borderColor: sub.color },
                ]}
                onPress={() => handleSubjectSelect(sub.value)}
              >
                <Text
                  style={[
                    styles.subjectPillText,
                    isSelected && styles.subjectPillTextActive,
                  ]}
                >
                  {sub.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Postagens */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando postagens...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => navigation.navigate('PostDetails', { id: item.id, post: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Nenhuma aula encontrada"
              subtitle={
                searchTerm
                  ? `Não encontramos resultados para "${searchTerm}". Tente outras palavras.`
                  : 'Nenhuma postagem publicada no momento.'
              }
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  greetingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  profileBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  subjectsContainer: {
    backgroundColor: COLORS.surface,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  subjectsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  subjectPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subjectPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  subjectPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  subjectPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
