import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../utils/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error = null,
  leftIcon = null,
  multiline = false,
  numberOfLines = 1,
  style = {},
  testID,
  editable = true,
  onPressIn,
  autoCorrect = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    if (onPressIn) {
      onPressIn();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.errorInput,
          !editable && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            secureTextEntry && styles.inputWithRightIcon,
            multiline && styles.multiline,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          testID={testID}
          editable={editable}
          onPressIn={onPressIn}
          autoCorrect={autoCorrect}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={theme.colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: theme.fontSizes.s,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    color: theme.colors.text,
    fontSize: theme.fontSizes.m,
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing.xl,
  },
  leftIcon: {
    paddingLeft: theme.spacing.m,
  },
  rightIcon: {
    padding: theme.spacing.s,
    position: 'absolute',
    right: 0,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
  errorInput: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.xs,
    marginTop: theme.spacing.xs,
  },
  multiline: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  disabled: {
    backgroundColor: theme.colors.lightGray,
    opacity: 0.7,
  },
});

export default Input;
