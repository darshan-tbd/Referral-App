import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  FormControl,
  Icon,
  Pressable,
  useToast,
  Center,
  Heading,
  StatusBar,
  Divider,
  Alert,
  Circle,
  Badge,
  Spinner,
} from 'native-base';
import { Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const { login } = useAuth();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'register') {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
        toast.show({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
          status: 'success',
          duration: 3000,
          placement: 'top',
        });
      } else {
        // Register logic would go here
        toast.show({
          title: 'Account created!',
          description: 'Your account has been created successfully.',
          status: 'success',
          duration: 3000,
          placement: 'top',
        });
      }
    } catch (error) {
      toast.show({
        title: authMode === 'login' ? 'Login failed' : 'Registration failed',
        description: error.message || 'Please check your credentials and try again.',
        status: 'error',
        duration: 4000,
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('john@example.com');
    setPassword('password123');
    setAuthMode('login');
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setErrors({});
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const InputField = ({ 
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    isPassword, 
    showPassword, 
    togglePassword, 
    error, 
    keyboardType,
    autoCapitalize = 'none',
    autoComplete,
    ...props 
  }) => (
    <FormControl isInvalid={!!error} mb={4}>
      <VStack space={2}>
        <Box
          bg="white"
          borderRadius="2xl"
          borderWidth={2}
          borderColor={error ? "error.400" : "gray.100"}
          shadow={error ? "none" : "xs"}
          _focus={{ borderColor: "primary.500", shadow: "sm" }}
        >
          <HStack alignItems="center" px={5} py={4}>
            <Box bg={error ? "error.100" : "gray.100"} p={2} borderRadius="xl" mr={3}>
              <Icon
                as={Ionicons}
                name={icon}
                size="sm"
                color={error ? "error.600" : "gray.600"}
              />
            </Box>
            <Input
              flex={1}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              type={isPassword && !showPassword ? 'password' : 'text'}
              fontSize="md"
              fontWeight="medium"
              color="gray.800"
              placeholderTextColor="gray.400"
              border="0"
              bg="transparent"
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              _focus={{
                bg: "transparent",
                borderWidth: 0,
              }}
              {...props}
            />
            {isPassword && (
              <Pressable onPress={togglePassword} ml={2}>
                <Box bg="gray.100" p={2} borderRadius="lg">
                  <Icon
                    as={Ionicons}
                    name={showPassword ? "eye-off" : "eye"}
                    size="sm"
                    color="gray.600"
                  />
                </Box>
              </Pressable>
            )}
          </HStack>
        </Box>
        {error && (
          <HStack alignItems="center" space={2} px={2}>
            <Icon as={Ionicons} name="alert-circle" size="xs" color="error.600" />
            <Text fontSize="xs" color="error.600" fontWeight="medium">
              {error}
            </Text>
          </HStack>
        )}
      </VStack>
    </FormControl>
  );

  return (
    <Box flex={1} bg="white">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        flex={1}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section with Enhanced Gradient */}
          <Box position="relative" height={height * 0.4}>
            <LinearGradient
              colors={['#3B82F6', '#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: '100%',
              }}
            />

            {/* Enhanced Floating Design Elements */}
            <Circle size="120" bg="white" opacity={0.08} position="absolute" top={-20} right={-30} />
            <Circle size="80" bg="white" opacity={0.06} position="absolute" top={40} left={-20} />
            <Circle size="60" bg="white" opacity={0.04} position="absolute" bottom={60} right={80} />
            <Circle size="40" bg="white" opacity={0.10} position="absolute" bottom={40} left={60} />

            <Center flex={1} px={6} safeAreaTop>
              <VStack alignItems="center" space={6}>
                {/* Enhanced Logo */}
                <Box position="relative">
                  <Box
                    bg="white"
                    p={6}
                    borderRadius="3xl"
                    shadow="xl"
                    borderWidth={4}
                    borderColor="white"
                  >
                    <Icon
                      as={Ionicons}
                      name="business"
                      size="3xl"
                      color="primary.600"
                    />
                  </Box>
                  <Circle
                    size={4}
                    bg="success.500"
                    position="absolute"
                    top={1}
                    right={1}
                    borderWidth={2}
                    borderColor="white"
                  />
                </Box>

                {/* Enhanced Title Section */}
                <VStack alignItems="center" space={3}>
                  <Heading fontSize="3xl" fontWeight="extrabold" color="white" textAlign="center">
                    ReferralPro
                  </Heading>
                  <Text fontSize="lg" color="white" opacity={0.9} textAlign="center" fontWeight="medium">
                    Your trusted referral partner
                  </Text>
                  <HStack space={4} mt={2}>
                    <HStack alignItems="center" space={2}>
                      <Icon as={Ionicons} name="shield-checkmark" size="sm" color="white" />
                      <Text fontSize="sm" color="white" opacity={0.8}>Secure</Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={Ionicons} name="flash" size="sm" color="white" />
                      <Text fontSize="sm" color="white" opacity={0.8}>Fast</Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={Ionicons} name="people" size="sm" color="white" />
                      <Text fontSize="sm" color="white" opacity={0.8}>Trusted</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </VStack>
            </Center>
          </Box>

          {/* Enhanced Form Section */}
          <Box flex={1} bg="background.secondary" px={6} py={8} borderTopRadius="3xl" mt={-8}>
            <VStack space={6}>
              {/* Enhanced Welcome Text */}
              <VStack space={3}>
                <Heading fontSize="2xl" fontWeight="bold" color="gray.800">
                  {authMode === 'login' ? 'Welcome back!' : 'Create your account'}
                </Heading>
                <Text fontSize="md" color="gray.600" lineHeight="md">
                  {authMode === 'login'
                    ? 'Sign in to access your referral dashboard and manage your applications'
                    : 'Join thousands of users who trust us with their referral management'
                  }
                </Text>
              </VStack>

              {/* Enhanced Demo Login Alert */}
              {authMode === 'login' && (
                <Box bg="primary.50" borderRadius="2xl" p={4} borderWidth={1} borderColor="primary.100">
                  <VStack space={3}>
                    <HStack alignItems="center" justifyContent="space-between">
                      <HStack alignItems="center" space={3}>
                        <Box bg="primary.100" p={2} borderRadius="xl">
                          <Icon as={Ionicons} name="information-circle" size="sm" color="primary.600" />
                        </Box>
                        <VStack>
                          <Text fontSize="sm" color="primary.800" fontWeight="bold">
                            Try Demo Account
                          </Text>
                          <Text fontSize="xs" color="primary.600">
                            Experience the app instantly
                          </Text>
                        </VStack>
                      </HStack>
                      <Button
                        size="sm"
                        colorScheme="primary"
                        onPress={handleDemoLogin}
                        borderRadius="xl"
                        px={4}
                        _text={{ fontWeight: 'semibold' }}
                      >
                        Try Demo
                      </Button>
                    </HStack>
                    <Box bg="primary.100" p={3} borderRadius="xl">
                      <Text fontSize="xs" color="primary.700" fontWeight="medium">
                        📧 john@example.com • 🔑 password123
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              )}

              {/* Enhanced Form Fields */}
              <VStack space={4}>
                {authMode === 'register' && (
                  <InputField
                    icon="person"
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    error={errors.name}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                )}

                <InputField
                  icon="mail"
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <InputField
                  icon="lock-closed"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  isPassword={true}
                  showPassword={showPassword}
                  togglePassword={() => setShowPassword(!showPassword)}
                  autoCapitalize="none"
                  autoComplete="password"
                />

                {authMode === 'register' && (
                  <InputField
                    icon="lock-closed"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    error={errors.confirmPassword}
                    isPassword={true}
                    showPassword={showConfirmPassword}
                    togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                )}
              </VStack>

              {/* Enhanced Additional Options */}
              {authMode === 'login' && (
                <HStack alignItems="center" justifyContent="space-between">
                  <Pressable onPress={() => setRememberMe(!rememberMe)}>
                    <HStack alignItems="center" space={3}>
                      <Box
                        w={6}
                        h={6}
                        borderRadius="lg"
                        borderWidth={2}
                        borderColor={rememberMe ? "primary.500" : "gray.300"}
                        bg={rememberMe ? "primary.500" : "white"}
                        alignItems="center"
                        justifyContent="center"
                      >
                        {rememberMe && (
                          <Icon as={Ionicons} name="checkmark" size="xs" color="white" />
                        )}
                      </Box>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Remember me
                      </Text>
                    </HStack>
                  </Pressable>
                  <Pressable onPress={() => {}}>
                    <HStack alignItems="center" space={1}>
                      <Text fontSize="sm" color="primary.600" fontWeight="semibold">
                        Forgot Password?
                      </Text>
                      <Icon as={Ionicons} name="arrow-forward" size="xs" color="primary.600" />
                    </HStack>
                  </Pressable>
                </HStack>
              )}

              {/* Enhanced Submit Button */}
              <VStack space={3}>
                <Button
                  onPress={handleAuth}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  size="lg"
                  borderRadius="2xl"
                  bg="primary.600"
                  _pressed={{ bg: "primary.700", transform: [{ scale: 0.98 }] }}
                  shadow="md"
                  py={4}
                  leftIcon={
                    isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <Icon
                        as={Ionicons}
                        name={authMode === 'login' ? "log-in" : "person-add"}
                        size="sm"
                        color="white"
                      />
                    )
                  }
                >
                  <Text fontSize="md" fontWeight="bold" color="white">
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </Text>
                </Button>

                {/* Enhanced Switch Auth Mode */}
                <Center>
                  <HStack alignItems="center" space={2}>
                    <Text fontSize="sm" color="gray.600">
                      {authMode === 'login'
                        ? "Don't have an account?"
                        : "Already have an account?"
                      }
                    </Text>
                    <Pressable onPress={switchAuthMode}>
                      <HStack alignItems="center" space={1}>
                        <Text fontSize="sm" color="primary.600" fontWeight="bold">
                          {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                        </Text>
                        <Icon as={Ionicons} name="arrow-forward" size="xs" color="primary.600" />
                      </HStack>
                    </Pressable>
                  </HStack>
                </Center>
              </VStack>

              {/* Enhanced Footer */}
              <VStack space={4} mt={6}>
                <Divider />
                <VStack space={3}>
                  <HStack alignItems="center" justifyContent="center" space={6}>
                    <HStack alignItems="center" space={2}>
                      <Icon as={Ionicons} name="shield-checkmark" size="sm" color="success.500" />
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        SSL Secured
                      </Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={Ionicons} name="lock-closed" size="sm" color="primary.500" />
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        Encrypted
                      </Text>
                    </HStack>
                    <HStack alignItems="center" space={2}>
                      <Icon as={Ionicons} name="checkmark-circle" size="sm" color="success.500" />
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        Verified
                      </Text>
                    </HStack>
                  </HStack>
                  <Center>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Need help?{' '}
                      <Text color="primary.600" fontWeight="semibold">
                        Contact Support
                      </Text>
                      {' '}• By continuing, you agree to our{' '}
                      <Text color="primary.600" fontWeight="semibold">
                        Terms of Service
                      </Text>
                    </Text>
                  </Center>
                </VStack>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};

export default AuthScreen; 