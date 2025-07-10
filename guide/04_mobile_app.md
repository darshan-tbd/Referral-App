# Mobile App Development Guide

## 📱 Overview

This guide covers the React Native mobile application development for the Referral Client App using Expo. The app provides a seamless mobile experience for visa consultancy clients to track progress, receive notifications, and submit referrals.

## 🏗️ Project Structure

### Expo React Native Structure
```
mobile/
├── app/                          # Expo Router (App Router)
│   ├── (auth)/                   # Auth group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── dashboard.tsx
│   │   ├── progress.tsx
│   │   ├── notifications.tsx
│   │   └── profile.tsx
│   ├── referral/                 # Referral screens
│   │   ├── create.tsx
│   │   └── history.tsx
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                       # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Loading.tsx
│   ├── auth/                     # Auth components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── progress/                 # Progress components
│   │   ├── ProgressBar.tsx
│   │   └── StageCard.tsx
│   └── referral/                 # Referral components
│       ├── ReferralForm.tsx
│       └── ReferralCard.tsx
├── services/                     # API services
│   ├── AuthService.ts
│   ├── UserService.ts
│   └── ReferralService.ts
├── context/                      # React contexts
│   ├── AuthContext.tsx
│   ├── NotificationContext.tsx
│   └── ThemeContext.tsx
├── utils/                        # Utilities
│   ├── validation.ts
│   ├── storage.ts
│   └── notifications.ts
├── constants/                    # Constants
│   ├── Colors.ts
│   └── Config.ts
└── types/                        # TypeScript types
    ├── auth.ts
    ├── user.ts
    └── referral.ts
```

## 🎨 UI Components with NativeBase

### Base Button Component
```tsx
// components/ui/Button.tsx
import React from 'react';
import { Button as NBButton, IButtonProps, Text } from 'native-base';

interface ButtonProps extends IButtonProps {
  title: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'solid',
  size = 'md',
  loading = false,
  ...props
}) => {
  return (
    <NBButton
      variant={variant}
      size={size}
      isLoading={loading}
      loadingText="Loading..."
      {...props}
    >
      <Text color={variant === 'outline' ? 'primary.500' : 'white'}>
        {title}
      </Text>
    </NBButton>
  );
};
```

### Input Component
```tsx
// components/ui/Input.tsx
import React from 'react';
import { Input as NBInput, IInputProps, FormControl } from 'native-base';

interface InputProps extends IInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  required,
  ...props
}) => {
  return (
    <FormControl isInvalid={!!error} isRequired={required}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      <NBInput
        bg="gray.50"
        borderColor="gray.300"
        _focus={{
          borderColor: 'primary.500',
          bg: 'white'
        }}
        {...props}
      />
      {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
    </FormControl>
  );
};
```

### Card Component
```tsx
// components/ui/Card.tsx
import React from 'react';
import { Box, IBoxProps } from 'native-base';

interface CardProps extends IBoxProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      shadow="sm"
      p={4}
      mb={4}
      {...props}
    >
      {children}
    </Box>
  );
};
```

## 🔐 Authentication Screens

### Login Screen
```tsx
// app/(auth)/login.tsx
import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Link, useToast } from 'native-base';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { validateEmail } from '../../utils/validation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      await login(email, password);
      toast.show({
        title: 'Welcome back!',
        status: 'success',
        description: 'You have successfully logged in.'
      });
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      toast.show({
        title: 'Login Failed',
        status: 'error',
        description: error.message || 'Please check your credentials and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="gray.50" safeAreaTop>
      <VStack flex={1} justifyContent="center" px={6} space={6}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={2}>
            Welcome Back
          </Text>
          <Text fontSize="md" color="gray.600" textAlign="center">
            Sign in to your account
          </Text>
        </Box>
        
        <VStack space={4}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            required
          />
          
          <Link href="/forgot-password" alignSelf="flex-end">
            <Text color="primary.500" fontSize="sm">
              Forgot Password?
            </Text>
          </Link>
        </VStack>
        
        <Button
          title="Sign In"
          loading={loading}
          onPress={handleLogin}
        />
        
        <HStack justifyContent="center">
          <Text fontSize="sm" color="gray.600">
            Don't have an account?{' '}
          </Text>
          <Link href="/register">
            <Text color="primary.500" fontSize="sm" fontWeight="medium">
              Sign Up
            </Text>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
}
```

### Register Screen
```tsx
// app/(auth)/register.tsx
import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Link, useToast, ScrollView } from 'native-base';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { validateEmail, validatePassword } from '../../utils/validation';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      toast.show({
        title: 'Account Created!',
        status: 'success',
        description: 'Welcome to the Referral App!'
      });
      
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      toast.show({
        title: 'Registration Failed',
        status: 'error',
        description: error.message || 'Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="gray.50" safeAreaTop>
      <ScrollView>
        <VStack flex={1} justifyContent="center" px={6} py={8} space={6}>
          <Box>
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={2}>
              Create Account
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
              Join us to track your visa journey
            </Text>
          </Box>
          
          <VStack space={4}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
              error={errors.name}
              required
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />
            
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => setFormData(prev => ({ ...prev, phone: value }))}
              error={errors.phone}
              keyboardType="phone-pad"
              required
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => setFormData(prev => ({ ...prev, password: value }))}
              error={errors.password}
              secureTextEntry
              required
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
              error={errors.confirmPassword}
              secureTextEntry
              required
            />
          </VStack>
          
          <Button
            title="Create Account"
            loading={loading}
            onPress={handleRegister}
          />
          
          <HStack justifyContent="center">
            <Text fontSize="sm" color="gray.600">
              Already have an account?{' '}
            </Text>
            <Link href="/login">
              <Text color="primary.500" fontSize="sm" fontWeight="medium">
                Sign In
              </Text>
            </Link>
          </HStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}
```

## 🏠 Dashboard Screen

### Dashboard Implementation
```tsx
// app/(tabs)/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, ScrollView, useToast, Pressable } from 'native-base';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/progress/ProgressBar';
import UserService from '../../services/UserService';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [visaProgress, setVisaProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentNotifications, setRecentNotifications] = useState([]);
  
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [progressData, notificationData] = await Promise.all([
        UserService.getVisaProgress(user.id),
        UserService.getNotifications(user.id)
      ]);
      
      setVisaProgress(progressData);
      setRecentNotifications(notificationData.slice(0, 3));
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Refer Someone',
      icon: 'person-add',
      color: 'primary.500',
      onPress: () => router.push('/referral/create')
    },
    {
      title: 'View Progress',
      icon: 'trending-up',
      color: 'green.500',
      onPress: () => router.push('/(tabs)/progress')
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      color: 'orange.500',
      onPress: () => router.push('/(tabs)/notifications')
    }
  ];

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" safeAreaTop>
      <ScrollView>
        <VStack space={6} px={4} py={6}>
          {/* Welcome Section */}
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              Welcome back, {user.name}!
            </Text>
            <Text fontSize="md" color="gray.600">
              Here's your visa application progress
            </Text>
          </Box>

          {/* Progress Overview */}
          <Card>
            <VStack space={4}>
              <Text fontSize="lg" fontWeight="semibold">
                Visa Application Progress
              </Text>
              {visaProgress && (
                <ProgressBar
                  stages={visaProgress.stages}
                  currentStage={visaProgress.currentStage}
                />
              )}
            </VStack>
          </Card>

          {/* Quick Actions */}
          <Card>
            <VStack space={4}>
              <Text fontSize="lg" fontWeight="semibold">
                Quick Actions
              </Text>
              <HStack space={3} flexWrap="wrap">
                {quickActions.map((action, index) => (
                  <Pressable
                    key={index}
                    flex={1}
                    minW="30%"
                    onPress={action.onPress}
                  >
                    <VStack
                      alignItems="center"
                      space={2}
                      bg="gray.50"
                      borderRadius="md"
                      p={4}
                    >
                      <Ionicons 
                        name={action.icon} 
                        size={24} 
                        color={action.color} 
                      />
                      <Text fontSize="sm" textAlign="center">
                        {action.title}
                      </Text>
                    </VStack>
                  </Pressable>
                ))}
              </HStack>
            </VStack>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <VStack space={4}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="semibold">
                  Recent Updates
                </Text>
                <Pressable onPress={() => router.push('/(tabs)/notifications')}>
                  <Text color="primary.500" fontSize="sm">
                    View All
                  </Text>
                </Pressable>
              </HStack>
              
              {recentNotifications.length > 0 ? (
                <VStack space={3}>
                  {recentNotifications.map((notification, index) => (
                    <Box key={index} borderLeftWidth={3} borderLeftColor="primary.500" pl={3}>
                      <Text fontSize="sm" fontWeight="medium">
                        {notification.title}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {notification.message}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No recent notifications
                </Text>
              )}
            </VStack>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  );
}
```

## 📊 Progress Tracking Components

### Progress Bar Component
```tsx
// components/progress/ProgressBar.tsx
import React from 'react';
import { HStack, VStack, Box, Text, Circle } from 'native-base';

interface Stage {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: string;
}

interface ProgressBarProps {
  stages: Stage[];
  currentStage: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stages, currentStage }) => {
  const getStageColor = (stage: Stage) => {
    if (stage.completed) return 'green.500';
    if (stage.id === currentStage) return 'primary.500';
    return 'gray.300';
  };

  return (
    <VStack space={4}>
      {stages.map((stage, index) => (
        <HStack key={stage.id} alignItems="center" space={3}>
          <Circle
            size={8}
            bg={getStageColor(stage)}
            justifyContent="center"
            alignItems="center"
          >
            <Text color="white" fontSize="xs" fontWeight="bold">
              {index + 1}
            </Text>
          </Circle>
          
          <VStack flex={1}>
            <Text fontSize="md" fontWeight="medium">
              {stage.name}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {stage.completed 
                ? `Completed on ${new Date(stage.completedAt).toLocaleDateString()}`
                : stage.id === currentStage 
                  ? 'In Progress'
                  : 'Pending'
              }
            </Text>
          </VStack>
          
          {stage.completed && (
            <Box>
              <Text color="green.500" fontSize="xs">
                ✓ Done
              </Text>
            </Box>
          )}
        </HStack>
      ))}
    </VStack>
  );
};
```

## 🔔 Notifications Screen

### Notifications Implementation
```tsx
// app/(tabs)/notifications.tsx
import React, { useEffect, useState } from 'react';
import { Box, VStack, Text, ScrollView, useToast, Pressable, HStack } from 'native-base';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import NotificationService from '../../services/NotificationService';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationService.getUserNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Failed to load notifications'
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Failed to mark notification as read'
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_update': return 'trending-up';
      case 'reminder': return 'time';
      case 'referral': return 'person-add';
      default: return 'notifications';
    }
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Loading notifications...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" safeAreaTop>
      <ScrollView>
        <VStack space={4} px={4} py={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Notifications
          </Text>
          
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Pressable
                key={notification.id}
                onPress={() => !notification.read && markAsRead(notification.id)}
              >
                <Card
                  bg={notification.read ? 'white' : 'primary.50'}
                  borderLeftWidth={notification.read ? 0 : 3}
                  borderLeftColor="primary.500"
                >
                  <HStack space={3} alignItems="flex-start">
                    <Box mt={1}>
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={notification.read ? '#9CA3AF' : '#3B82F6'}
                      />
                    </Box>
                    
                    <VStack flex={1} space={1}>
                      <Text
                        fontSize="md"
                        fontWeight={notification.read ? 'normal' : 'semibold'}
                      >
                        {notification.title}
                      </Text>
                      <Text
                        fontSize="sm"
                        color={notification.read ? 'gray.600' : 'gray.800'}
                      >
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                    
                    {!notification.read && (
                      <Circle size={2} bg="primary.500" />
                    )}
                  </HStack>
                </Card>
              </Pressable>
            ))
          ) : (
            <Card>
              <VStack alignItems="center" space={4} py={8}>
                <Ionicons name="notifications-off" size={48} color="#9CA3AF" />
                <Text fontSize="lg" color="gray.600">
                  No notifications yet
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  You'll receive updates about your visa application progress here
                </Text>
              </VStack>
            </Card>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}
```

## 🎯 Referral System

### Referral Form Component
```tsx
// components/referral/ReferralForm.tsx
import React, { useState } from 'react';
import { VStack, useToast } from 'native-base';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import ReferralService from '../../services/ReferralService';
import { validateEmail } from '../../utils/validation';

export const ReferralForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    visaType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const toast = useToast();

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.visaType) newErrors.visaType = 'Visa type is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      await ReferralService.createReferral({
        referrerId: user.id,
        referredName: formData.name,
        referredEmail: formData.email,
        referredPhone: formData.phone,
        referredCountry: formData.country,
        visaType: formData.visaType
      });
      
      toast.show({
        title: 'Referral Submitted!',
        status: 'success',
        description: 'Your referral has been submitted successfully.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        visaType: ''
      });
    } catch (error) {
      toast.show({
        title: 'Error',
        status: 'error',
        description: 'Failed to submit referral. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack space={4}>
      <Input
        label="Full Name"
        placeholder="Enter referral's full name"
        value={formData.name}
        onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
        error={errors.name}
        required
      />
      
      <Input
        label="Email"
        placeholder="Enter referral's email"
        value={formData.email}
        onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      
      <Input
        label="Phone Number"
        placeholder="Enter referral's phone number"
        value={formData.phone}
        onChangeText={(value) => setFormData(prev => ({ ...prev, phone: value }))}
        error={errors.phone}
        keyboardType="phone-pad"
        required
      />
      
      <Input
        label="Country"
        placeholder="Enter referral's country"
        value={formData.country}
        onChangeText={(value) => setFormData(prev => ({ ...prev, country: value }))}
        error={errors.country}
        required
      />
      
      <Input
        label="Visa Type"
        placeholder="Enter desired visa type"
        value={formData.visaType}
        onChangeText={(value) => setFormData(prev => ({ ...prev, visaType: value }))}
        error={errors.visaType}
        required
      />
      
      <Button
        title="Submit Referral"
        loading={loading}
        onPress={handleSubmit}
      />
    </VStack>
  );
};
```

## 🎨 Theme and Styling

### NativeBase Theme Configuration
```tsx
// theme/theme.ts
import { extendTheme } from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#EBF8FF',
      100: '#BEE3F8',
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#3182CE',
      600: '#2B77CB',
      700: '#2C5282',
      800: '#2A4365',
      900: '#1A365D',
    },
  },
  config: {
    initialColorMode: 'light',
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 'md',
      },
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Input: {
      baseStyle: {
        rounded: 'md',
      },
    },
  },
});
```

### App Layout with Theme
```tsx
// app/_layout.tsx
import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { theme } from '../theme/theme';

export default function RootLayout() {
  return (
    <NativeBaseProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="referral" />
        </Stack>
      </AuthProvider>
    </NativeBaseProvider>
  );
}
```

## 🔄 State Management

### Notification Context
```tsx
// context/NotificationContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import NotificationService from '../services/NotificationService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
}

const NotificationContext = createContext<{
  state: NotificationState;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0,
    loading: false
  });
  
  const { user } = useAuth();

  const refreshNotifications = async () => {
    if (!user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const notifications = await NotificationService.getUserNotifications(user.id);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      dispatch({ type: 'MARK_AS_READ', payload: id });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      state,
      refreshNotifications,
      markAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

const notificationReducer = (state: NotificationState, action: any) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1
      };
    default:
      return state;
  }
};
```

## 🚀 Build and Deployment

### Expo Configuration
```json
// app.json
{
  "expo": {
    "name": "Referral Client App",
    "slug": "referral-client-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.company.referralclientapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.company.referralclientapp"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-notifications",
      "expo-secure-store"
    ]
  }
}
```

### Build Commands
```bash
# Development
expo start

# Build for testing
eas build --platform android --profile preview
eas build --platform ios --profile preview

# Production build
eas build --platform all --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

This mobile app architecture provides a solid foundation for a scalable React Native application with proper state management, navigation, and UI components. 