import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Image,
  Alert,
  AlertDialog,
  ScrollView,
  KeyboardAvoidingView,
  FormControl,
  Icon,
  Pressable,
  useToast,
} from 'native-base';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
      toast.show({
        title: 'Login Successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast.show({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('john@example.com');
    setPassword('password123');
    
    setTimeout(() => {
      handleLogin();
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Box flex={1} bg="white" safeArea>
          {/* Header Section */}
          <Box bg="primary.500" pt={10} pb={6} px={6}>
            <VStack alignItems="center" space={4}>
              <Box
                bg="white"
                p={4}
                rounded="full"
                shadow={3}
              >
                <Icon
                  as={Ionicons}
                  name="business"
                  size="xl"
                  color="primary.500"
                />
              </Box>
              <VStack alignItems="center" space={2}>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                  Visa Consultancy
                </Text>
                <Text fontSize="md" color="primary.100">
                  Client Portal
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Login Form */}
          <Box flex={1} px={6} pt={8}>
            <VStack space={6}>
              <VStack space={2}>
                <Text fontSize="xl" fontWeight="bold" color="gray.700">
                  Welcome Back
                </Text>
                <Text fontSize="md" color="gray.500">
                  Sign in to access your visa application dashboard
                </Text>
              </VStack>

              {/* Demo Login Helper */}
              <Alert status="info" borderRadius="md">
                <Alert.Icon />
                <VStack flex={1} space={2}>
                  <Text fontSize="sm" color="info.600" fontWeight="medium">
                    Demo Account Available
                  </Text>
                  <Text fontSize="xs" color="info.500">
                    Email: john@example.com | Password: password123
                  </Text>
                </VStack>
              </Alert>

              <VStack space={4}>
                {/* Email Input */}
                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormControl.Label>Email Address</FormControl.Label>
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    size="lg"
                    InputLeftElement={
                      <Icon
                        as={Ionicons}
                        name="mail"
                        size="sm"
                        ml={3}
                        color="gray.400"
                      />
                    }
                  />
                  {errors.email && (
                    <FormControl.ErrorMessage>
                      {errors.email}
                    </FormControl.ErrorMessage>
                  )}
                </FormControl>

                {/* Password Input */}
                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    autoCapitalize="none"
                    size="lg"
                    InputLeftElement={
                      <Icon
                        as={Ionicons}
                        name="lock-closed"
                        size="sm"
                        ml={3}
                        color="gray.400"
                      />
                    }
                    InputRightElement={
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                          as={Ionicons}
                          name={showPassword ? 'eye-off' : 'eye'}
                          size="sm"
                          mr={3}
                          color="gray.400"
                        />
                      </Pressable>
                    }
                  />
                  {errors.password && (
                    <FormControl.ErrorMessage>
                      {errors.password}
                    </FormControl.ErrorMessage>
                  )}
                </FormControl>
              </VStack>

              {/* Login Button */}
              <Button
                onPress={handleLogin}
                isLoading={isLoading}
                isLoadingText="Signing In..."
                size="lg"
                colorScheme="primary"
                borderRadius="lg"
                _text={{
                  fontWeight: 'semibold',
                }}
              >
                Sign In
              </Button>

              {/* Demo Login Button */}
              <Button
                onPress={handleDemoLogin}
                variant="outline"
                size="lg"
                colorScheme="primary"
                borderRadius="lg"
                isDisabled={isLoading}
                _text={{
                  fontWeight: 'semibold',
                }}
              >
                Try Demo Account
              </Button>

              {/* Help Section */}
              <VStack space={4} pt={4}>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Having trouble accessing your account?
                </Text>
                
                <VStack space={2}>
                  <HStack justifyContent="center" alignItems="center" space={2}>
                    <Icon as={Ionicons} name="call" size="xs" color="primary.500" />
                    <Text fontSize="sm" color="primary.500">
                      Call Support: +1-800-VISA-HELP
                    </Text>
                  </HStack>
                  
                  <HStack justifyContent="center" alignItems="center" space={2}>
                    <Icon as={Ionicons} name="mail" size="xs" color="primary.500" />
                    <Text fontSize="sm" color="primary.500">
                      Email: support@visaconsultancy.com
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </Box>

          {/* Footer */}
          <Box px={6} py={4} bg="gray.50">
            <VStack space={2} alignItems="center">
              <Text fontSize="xs" color="gray.400" textAlign="center">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Text>
              <HStack space={2} alignItems="center">
                <Icon as={Ionicons} name="shield-checkmark" size="xs" color="green.500" />
                <Text fontSize="xs" color="gray.500">
                  Secure & Encrypted
                </Text>
              </HStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen; 