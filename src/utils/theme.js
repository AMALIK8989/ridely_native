const theme = {
  colors: {
    primary: '#6A0DAD', // Royal Purple (main brand color)
    accent: '#FFD700', // Gold (accent color)
    background: '#F5F5F5', // Light Gray (background)
    text: '#1A1A1A', // Almost Black (text)
    white: '#FFFFFF', // White (cards, containers)
    error: '#E53935', // Red (error messages)
    success: '#4CAF50', // Green (success messages)
    info: '#2196F3', // Blue (information messages)
    warning: '#FF9800', // Orange (warning messages)
    black: '#000000', // Black
    gray: '#9E9E9E', // Gray
    lightGray: '#EEEEEE', // Light Gray
    transparent: 'transparent',
  },

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },

  fontSizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    round: 9999,
  },

  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 7,
      elevation: 10,
    },
  },
};

export default theme;
