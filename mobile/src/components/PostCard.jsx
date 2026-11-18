import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Badge } from './Badge';
import { getSubjectInfo, getContentTypeInfo, getStatusInfo } from '../constants/postConstants';

export const PostCard = ({
  post,
  onPress,
  onEdit,
  onDelete,
  showAdminActions = false,
}) => {
  const subject = getSubjectInfo(post.subject);
  const contentType = getContentTypeInfo(post.contentType);
  const status = getStatusInfo(post.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <Badge label={subject.label} color={subject.color} />
          <Badge
            label={contentType.label}
            color={COLORS.textSecondary}
            bgColor={COLORS.background}
            style={{ marginLeft: 6 }}
          />
        </View>

        {showAdminActions && (
          <Badge
            label={status.label}
            color={status.color}
            bgColor={status.bgColor}
          />
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {post.description || post.content}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.authorContainer}>
          <Ionicons name="person-circle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.authorText} numberOfLines={1}>
            {post.author || 'Docente'}
          </Text>
        </View>

        {showAdminActions ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionBtnEdit}
              onPress={(e) => {
                e.stopPropagation();
                onEdit && onEdit(post);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={15} color={COLORS.primary} />
              <Text style={styles.actionBtnEditText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnDelete}
              onPress={(e) => {
                e.stopPropagation();
                onDelete && onDelete(post);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
              <Text style={styles.actionBtnDeleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Ler conteúdo</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
  },
  actionBtnEditText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  actionBtnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: COLORS.dangerLight,
  },
  actionBtnDeleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
    marginLeft: 4,
  },
});
