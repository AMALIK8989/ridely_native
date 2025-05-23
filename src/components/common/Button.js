import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../../utils/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  style = {},
  textStyle = {},
}) => {
  // Define button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.white,
          borderColor: theme.colors.primary,
          borderWidth: 1,
        };
      case 'accent':
        return {
          backgroundColor: theme.colors.accent,
          borderColor: theme.colors.accent,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error,
          borderColor: theme.colors.error,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
    }
  };

  // Define text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.white;
      case 'secondary':
        return theme.colors.primary;
      case 'accent':
        return theme.colors.black;
      case 'danger':
        return theme.colors.white;
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.white;
    }
  };

  // Define button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
    }
  };

  // Define text size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return theme.fontSizes.s;
      case 'medium':
        return theme.fontSizes.m;
      case 'large':
        return theme.fontSizes.l;
      default:
        return theme.fontSizes.m;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        getButtonSize(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: getTextSize() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
