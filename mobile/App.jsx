import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { Box, VStack, Text, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

// Custom theme for the app
const theme = extendTheme({
  colors: {
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
    secondary: {
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
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: 'light',
  },
  components: {
    Button: {
      defaultProps: {
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          _text: {
            fontWeight: 'semibold',
          },
        },
        outline: {
          _text: {
            fontWeight: 'semibold',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        shadow: 1,
        borderRadius: 'xl',
        backgroundColor: 'white',
      },
    },
    Input: {
      defaultProps: {
        size: 'lg',
        borderRadius: 'lg',
      },
    },
    FormControl: {
      baseStyle: {
        _label: {
          fontSize: 'sm',
          fontWeight: 'medium',
          color: 'gray.700',
        },
      },
    },
    Badge: {
      defaultProps: {
        borderRadius: 'full',
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