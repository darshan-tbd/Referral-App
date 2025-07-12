import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { Box, VStack, Text, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

// Suppress SSRProvider warning from NativeBase in React 18
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('In React 18, SSRProvider is not necessary')) {
    return;
  }
  originalWarn(...args);
};

// Enhanced Custom Theme for Modern Design
const theme = extendTheme({
  colors: {
    // Primary brand colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    // Accent colors
    accent: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Success colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    // Warning colors
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    // Error colors
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    // Extended gray palette
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Neutral colors
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // Background colors
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
    },
    // Surface colors
    surface: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      elevated: '#ffffff',
    },
  },
  fonts: {
    heading: undefined,
    body: undefined,
    mono: undefined,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 40,
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  letterSpacings: {
    xs: -0.5,
    sm: -0.25,
    md: 0,
    lg: 0.25,
    xl: 0.5,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
  space: {
    px: 1,
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    36: 144,
    40: 160,
    44: 176,
    48: 192,
    52: 208,
    56: 224,
    60: 240,
    64: 256,
    72: 288,
    80: 320,
    96: 384,
  },
  radii: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
  },
  shadows: {
    xs: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 20,
      },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 5,
    },
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: 'light',
  },
  components: {
    Button: {
      defaultProps: {
        borderRadius: 'xl',
        _text: {
          fontWeight: 'semibold',
        },
      },
      variants: {
        solid: {
          shadow: 'sm',
          _pressed: {
            shadow: 'md',
          },
        },
        outline: {
          borderWidth: 1.5,
          _text: {
            fontWeight: 'semibold',
          },
        },
        subtle: {
          _text: {
            fontWeight: 'semibold',
          },
        },
        ghost: {
          _text: {
            fontWeight: 'semibold',
          },
        },
      },
      sizes: {
        xs: {
          px: 3,
          py: 2,
          _text: {
            fontSize: 'xs',
          },
        },
        sm: {
          px: 4,
          py: 2.5,
          _text: {
            fontSize: 'sm',
          },
        },
        md: {
          px: 6,
          py: 3,
          _text: {
            fontSize: 'md',
          },
        },
        lg: {
          px: 8,
          py: 4,
          _text: {
            fontSize: 'lg',
          },
        },
        xl: {
          px: 10,
          py: 5,
          _text: {
            fontSize: 'xl',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        shadow: 'sm',
        borderRadius: '2xl',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray.100',
        overflow: 'hidden',
      },
      variants: {
        elevated: {
          shadow: 'md',
          borderWidth: 0,
        },
        outlined: {
          borderWidth: 1,
          borderColor: 'gray.200',
          shadow: 'none',
        },
        subtle: {
          backgroundColor: 'gray.50',
          borderWidth: 0,
          shadow: 'none',
        },
      },
    },
    Input: {
      defaultProps: {
        size: 'lg',
        borderRadius: 'xl',
        borderWidth: 1.5,
        _focus: {
          borderColor: 'primary.500',
          backgroundColor: 'white',
        },
      },
      variants: {
        outline: {
          borderColor: 'gray.200',
          backgroundColor: 'white',
          _hover: {
            borderColor: 'gray.300',
          },
          _focus: {
            borderColor: 'primary.500',
            backgroundColor: 'white',
          },
        },
        filled: {
          backgroundColor: 'gray.50',
          borderColor: 'gray.50',
          _hover: {
            backgroundColor: 'gray.100',
          },
          _focus: {
            backgroundColor: 'white',
            borderColor: 'primary.500',
          },
        },
      },
    },
    FormControl: {
      baseStyle: {
        _label: {
          fontSize: 'sm',
          fontWeight: 'medium',
          color: 'gray.700',
          mb: 2,
        },
        _errorMessage: {
          fontSize: 'xs',
          color: 'error.600',
          mt: 1,
        },
        _helperText: {
          fontSize: 'xs',
          color: 'gray.500',
          mt: 1,
        },
      },
    },
    Badge: {
      defaultProps: {
        borderRadius: 'full',
        variant: 'solid',
      },
      variants: {
        solid: {
          _text: {
            fontSize: 'xs',
            fontWeight: 'semibold',
          },
        },
        outline: {
          borderWidth: 1,
          _text: {
            fontSize: 'xs',
            fontWeight: 'semibold',
          },
        },
        subtle: {
          _text: {
            fontSize: 'xs',
            fontWeight: 'semibold',
          },
        },
      },
    },
    Avatar: {
      defaultProps: {
        borderRadius: 'full',
      },
      variants: {
        elevated: {
          shadow: 'md',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        letterSpacing: 'sm',
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.700',
      },
      variants: {
        body: {
          fontSize: 'md',
          lineHeight: 'md',
        },
        caption: {
          fontSize: 'sm',
          color: 'gray.500',
        },
        label: {
          fontSize: 'sm',
          fontWeight: 'medium',
          color: 'gray.700',
        },
      },
    },
    Progress: {
      defaultProps: {
        borderRadius: 'full',
        size: 'md',
      },
    },
    Skeleton: {
      defaultProps: {
        borderRadius: 'md',
      },
    },
    Spinner: {
      defaultProps: {
        color: 'primary.500',
      },
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <NativeBaseProvider theme={theme}>
          <SafeAreaProvider>
            <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50" p={6}>
              <VStack alignItems="center" space={4}>
                <Box bg="red.100" p={4} borderRadius="full">
                  <Ionicons name="alert-circle" size={48} color="#EF4444" />
                </Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.700" textAlign="center">
                  Something went wrong
                </Text>
                <Text fontSize="md" color="gray.500" textAlign="center">
                  The app encountered an unexpected error. Please restart the app.
                </Text>
                <Button
                  onPress={() => this.setState({ hasError: false })}
                  colorScheme="red"
                  variant="outline"
                >
                  Try Again
                </Button>
              </VStack>
            </Box>
          </SafeAreaProvider>
        </NativeBaseProvider>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NativeBaseProvider theme={theme}>
          <AuthProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </AuthProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
} 