import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import theme from '../../utils/theme';

const Loading = ({ text = 'Loading...', fullScreen = true, size = 'large' }) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.primary,
    marginTop: theme.spacing.m,
    fontSize: theme.fontSizes.m,
    fontWeight: '500',
  },
});

export default Loading;
