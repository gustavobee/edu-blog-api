import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canGoBack && styles.buttonDisabled]}
        onPress={() => canGoBack && onPageChange(currentPage - 1)}
        disabled={!canGoBack}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-back"
          size={18}
          color={canGoBack ? COLORS.primary : COLORS.textMuted}
        />
        <Text style={[styles.buttonText, !canGoBack && styles.buttonTextDisabled]}>
          Anterior
        </Text>
      </TouchableOpacity>

      <View style={styles.pageIndicator}>
        <Text style={styles.pageText}>
          Página <Text style={styles.pageHighlight}>{currentPage}</Text> de{' '}
          <Text style={styles.pageHighlight}>{totalPages}</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !canGoForward && styles.buttonDisabled]}
        onPress={() => canGoForward && onPageChange(currentPage + 1)}
        disabled={!canGoForward}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, !canGoForward && styles.buttonTextDisabled]}>
          Próxima
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={canGoForward ? COLORS.primary : COLORS.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
  },
  buttonDisabled: {
    backgroundColor: COLORS.background,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginHorizontal: 4,
  },
  buttonTextDisabled: {
    color: COLORS.textMuted,
  },
  pageIndicator: {
    paddingHorizontal: 8,
  },
  pageText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  pageHighlight: {
    color: COLORS.text,
    fontWeight: '700',
  },
});
