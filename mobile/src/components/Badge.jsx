import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Badge = ({ label, color = '#4F46E5', bgColor, style, textStyle }) => {
  const calculatedBg = bgColor || `${color}18`;

  return (
    <View style={[styles.badge, { backgroundColor: calculatedBg, borderColor: `${color}40` }, style]}>
      <Text style={[styles.label, { color }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
