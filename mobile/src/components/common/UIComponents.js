import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  Badge,
  Progress,
  Skeleton,
  Spinner,
  Alert,
  Avatar,
  IconButton,
  Pressable,
  Heading,
  Center,
  Circle,
  Divider,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAvatarInitials } from '../../services/mockData';

// Loading Components
export const LoadingScreen = ({ message = 'Loading...' }) => (
  <Box flex={1} justifyContent="center" alignItems="center" bg="background.secondary" safeArea>
    <VStack alignItems="center" space={6}>
      <Box position="relative">
        <Circle size={16} bg="primary.500" opacity={0.1} />
        <Circle size={12} bg="primary.500" opacity={0.2} position="absolute" top={2} left={2} />
        <Circle size={8} bg="primary.500" opacity={0.3} position="absolute" top={4} left={4} />
        <Spinner size="lg" color="primary.500" position="absolute" top={6} left={6} />
      </Box>
      <VStack alignItems="center" space={2}>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          {message}
        </Text>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Please wait while we load your data
        </Text>
      </VStack>
    </VStack>
  </Box>
);

export const LoadingSpinner = ({ size = 'sm', color = 'primary.500' }) => (
  <Spinner size={size} color={color} />
);

export const SkeletonLoader = ({ lines = 3, height = 4 }) => (
  <VStack space={3}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton key={index} h={height} borderRadius="xl" startColor="gray.100" endColor="gray.50" />
    ))}
  </VStack>
);

// Modern Card Components
export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  trend,
  onPress,
  isHighlighted = false,
  size = 'md'
}) => (
  <Pressable onPress={onPress} flex={1} mx={1}>
    <Card 
      bg={isHighlighted ? `${color}.500` : 'white'} 
      borderRadius="2xl" 
      p={size === 'lg' ? 6 : 5}
      variant={isHighlighted ? 'elevated' : 'outlined'}
      _pressed={{ opacity: 0.8 }}
    >
      <VStack space={4}>
        {/* Header */}
        <HStack alignItems="center" justifyContent="space-between">
          <Box 
            bg={isHighlighted ? 'white' : `${color}.100`} 
            p={3} 
            borderRadius="xl"
            shadow={isHighlighted ? 'sm' : 'none'}
          >
            <Ionicons 
              name={icon} 
              size={size === 'lg' ? 28 : 24} 
              color={isHighlighted ? (color === 'primary' ? '#3B82F6' : color === 'success' ? '#22C55E' : '#F59E0B') : 'white'} 
            />
          </Box>
          {trend && (
            <Box bg={trend.positive ? 'success.100' : 'error.100'} px={2} py={1} borderRadius="full">
              <HStack alignItems="center" space={1}>
                <Ionicons 
                  name={trend.positive ? 'trending-up' : 'trending-down'} 
                  size={12} 
                  color={trend.positive ? '#22C55E' : '#EF4444'} 
                />
                <Text fontSize="xs" color={trend.positive ? 'success.600' : 'error.600'} fontWeight="semibold">
                  {trend.value}
                </Text>
              </HStack>
            </Box>
          )}
        </HStack>

        {/* Content */}
        <VStack space={1}>
          <Text 
            fontSize={size === 'lg' ? '3xl' : '2xl'} 
            fontWeight="extrabold" 
            color={isHighlighted ? 'white' : `${color}.600`}
          >
            {value}
          </Text>
          <Text 
            fontSize="sm" 
            color={isHighlighted ? 'white' : 'gray.600'} 
            fontWeight="medium"
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              fontSize="xs" 
              color={isHighlighted ? 'white' : 'gray.500'} 
              opacity={0.8}
            >
              {subtitle}
            </Text>
          )}
        </VStack>
      </VStack>
    </Card>
  </Pressable>
);

export const ActionCard = ({ 
  title, 
  icon, 
  onPress, 
  color = 'primary',
  description,
  badge,
  isLoading = false
}) => (
  <Pressable onPress={onPress} flex={1} mx={1} isDisabled={isLoading}>
    <Card 
      bg="white" 
      borderRadius="2xl" 
      p={5} 
      variant="outlined"
      _pressed={{ opacity: 0.8, transform: [{ scale: 0.98 }] }}
    >
      <VStack alignItems="center" space={4}>
        <Box position="relative">
          <Box bg={`${color}.100`} p={4} borderRadius="xl">
            {isLoading ? (
              <Spinner size="sm" color={`${color}.500`} />
            ) : (
              <Ionicons 
                name={icon} 
                size={28} 
                color={color === 'primary' ? '#3B82F6' : color === 'success' ? '#22C55E' : color === 'warning' ? '#F59E0B' : '#EF4444'} 
              />
            )}
          </Box>
          {badge && (
            <Badge 
              position="absolute" 
              top={-1} 
              right={-1} 
              colorScheme="error" 
              borderRadius="full"
              minW={5}
              h={5}
              p={0}
              _text={{ fontSize: 'xs' }}
            >
              {badge}
            </Badge>
          )}
        </Box>
        
        <VStack alignItems="center" space={1}>
          <Text fontSize="sm" fontWeight="semibold" color="gray.800" textAlign="center">
            {title}
          </Text>
          {description && (
            <Text fontSize="xs" color="gray.500" textAlign="center">
              {description}
            </Text>
          )}
        </VStack>
      </VStack>
    </Card>
  </Pressable>
);

export const InfoCard = ({ 
  title, 
  children, 
  actions,
  icon,
  color = 'primary',
  variant = 'outlined'
}) => (
  <Card bg="white" borderRadius="2xl" p={5} variant={variant}>
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" space={3}>
          {icon && (
            <Box bg={`${color}.100`} p={2} borderRadius="lg">
              <Ionicons name={icon} size={20} color={color === 'primary' ? '#3B82F6' : '#22C55E'} />
            </Box>
          )}
          <Heading fontSize="lg" fontWeight="bold" color="gray.800">
            {title}
          </Heading>
        </HStack>
        {actions && (
          <HStack space={2}>
            {actions}
          </HStack>
        )}
      </HStack>
      {children}
    </VStack>
  </Card>
);

// Status and Progress Components
export const StatusBadge = ({ status, variant = 'solid', size = 'md' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'success':
        return { colorScheme: 'success', icon: 'checkmark-circle' };
      case 'rejected':
      case 'failed':
      case 'error':
        return { colorScheme: 'error', icon: 'close-circle' };
      case 'pending':
      case 'warning':
        return { colorScheme: 'warning', icon: 'time' };
      case 'in_progress':
      case 'processing':
        return { colorScheme: 'primary', icon: 'sync' };
      default:
        return { colorScheme: 'gray', icon: 'ellipse' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      colorScheme={config.colorScheme}
      variant={variant}
      borderRadius="full"
      px={size === 'lg' ? 3 : 2}
      py={size === 'lg' ? 1 : 0.5}
    >
      <HStack alignItems="center" space={1}>
        <Ionicons name={config.icon} size={size === 'lg' ? 14 : 12} color="white" />
        <Text fontSize={size === 'lg' ? 'sm' : 'xs'} fontWeight="semibold" color="white">
          {status}
        </Text>
      </HStack>
    </Badge>
  );
};

export const ProgressIndicator = ({ 
  value, 
  max = 100, 
  colorScheme = 'primary', 
  size = 'md',
  showPercentage = true,
  label,
  animated = true
}) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <VStack space={3}>
      {label && (
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            {label}
          </Text>
          {showPercentage && (
            <Text fontSize="sm" color={`${colorScheme}.600`} fontWeight="semibold">
              {percentage}%
            </Text>
          )}
        </HStack>
      )}
      <Progress
        value={percentage}
        colorScheme={colorScheme}
        size={size}
        borderRadius="full"
        bg="gray.100"
        shadow="inset"
      />
      {!label && showPercentage && (
        <HStack justifyContent="space-between">
          <Text fontSize="xs" color="gray.500">
            {value} of {max}
          </Text>
          <Text fontSize="xs" color={`${colorScheme}.600`} fontWeight="medium">
            {percentage}%
          </Text>
        </HStack>
      )}
    </VStack>
  );
};

export const TimelineStep = ({ 
  step, 
  isActive = false, 
  isCompleted = false, 
  isLast = false 
}) => (
  <HStack space={4} alignItems="flex-start">
    <VStack alignItems="center" space={1}>
      <Box
        bg={isCompleted ? 'success.500' : isActive ? 'primary.500' : 'gray.300'}
        p={2}
        borderRadius="full"
        shadow={isActive || isCompleted ? 'sm' : 'none'}
      >
        <Ionicons 
          name={
            isCompleted ? 'checkmark' : 
            isActive ? 'time' : 
            'ellipse'
          } 
          size={16} 
          color="white" 
        />
      </Box>
      {!isLast && (
        <Box
          w={0.5}
          h={8}
          bg={isCompleted ? 'success.300' : 'gray.200'}
        />
      )}
    </VStack>
    
    <VStack flex={1} space={1} pb={isLast ? 0 : 4}>
      <Text fontSize="sm" fontWeight="semibold" color="gray.800">
        {step.title}
      </Text>
      {step.description && (
        <Text fontSize="xs" color="gray.500">
          {step.description}
        </Text>
      )}
      {step.timestamp && (
        <Text fontSize="xs" color="gray.400">
          {step.timestamp}
        </Text>
      )}
    </VStack>
  </HStack>
);

// Header Components
export const PageHeader = ({ 
  title, 
  subtitle, 
  actions,
  variant = 'gradient',
  showBack = false,
  onBack
}) => (
  <Box position="relative" borderRadius="2xl" overflow="hidden" mb={6}>
    {variant === 'gradient' ? (
      <LinearGradient
        colors={['#3B82F6', '#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24 }}
      >
        {/* Decorative elements */}
        <Circle size="60" bg="white" opacity={0.1} position="absolute" top={-10} right={-10} />
        <Circle size="40" bg="white" opacity={0.05} position="absolute" bottom={-5} left={-5} />
        
        <VStack space={3}>
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" space={3}>
              {showBack && (
                               <IconButton
                 icon={<Ionicons name="chevron-back" size={24} color="white" />}
                 onPress={onBack}
                 borderRadius="full"
                 bg="transparent"
                 _pressed={{ bg: 'white', opacity: 0.2 }}
               />
              )}
              <VStack>
                <Heading fontSize="xl" fontWeight="bold" color="white">
                  {title}
                </Heading>
                {subtitle && (
                  <Text fontSize="sm" color="white" opacity={0.9}>
                    {subtitle}
                  </Text>
                )}
              </VStack>
            </HStack>
            {actions && (
              <HStack space={2}>
                {actions}
              </HStack>
            )}
          </HStack>
        </VStack>
      </LinearGradient>
    ) : (
      <Box bg="white" p={6} borderRadius="2xl" shadow="sm">
        <HStack alignItems="center" justifyContent="space-between">
          <HStack alignItems="center" space={3}>
            {showBack && (
              <IconButton
                icon={<Ionicons name="chevron-back" size={24} color="gray.600" />}
                onPress={onBack}
                borderRadius="full"
                bg="gray.100"
                _pressed={{ bg: 'gray.200' }}
              />
            )}
            <VStack>
              <Heading fontSize="xl" fontWeight="bold" color="gray.800">
                {title}
              </Heading>
              {subtitle && (
                <Text fontSize="sm" color="gray.500">
                  {subtitle}
                </Text>
              )}
            </VStack>
          </HStack>
          {actions && (
            <HStack space={2}>
              {actions}
            </HStack>
          )}
        </HStack>
      </Box>
    )}
  </Box>
);

// User Components
export const UserAvatar = ({ user, size = 'md', showBadge = false, variant = 'default' }) => (
  <Box position="relative">
    <Avatar
      source={user?.avatar ? { uri: user.avatar } : undefined}
      size={size}
      bg="primary.500"
      borderWidth={variant === 'elevated' ? 3 : 0}
      borderColor="white"
      shadow={variant === 'elevated' ? 'md' : 'none'}
    >
      <Text fontSize={size === 'lg' ? 'lg' : 'md'} fontWeight="bold" color="white">
        {user?.name ? getAvatarInitials(user.name) : '?'}
      </Text>
    </Avatar>
    {showBadge && (
      <Circle
        size={4}
        bg="success.500"
        position="absolute"
        bottom={0}
        right={0}
        borderWidth={2}
        borderColor="white"
      />
    )}
  </Box>
);

export const UserCard = ({ user, actions, variant = 'default' }) => (
  <Card bg="white" borderRadius="2xl" p={5} variant="outlined">
    <HStack alignItems="center" space={4}>
      <UserAvatar user={user} size="lg" showBadge={user?.isOnline} variant="elevated" />
      <VStack flex={1} space={1}>
        <Text fontSize="lg" fontWeight="bold" color="gray.800">
          {user?.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {user?.email}
        </Text>
        {user?.role && (
          <Badge colorScheme="primary" variant="subtle" alignSelf="flex-start">
            {user.role}
          </Badge>
        )}
      </VStack>
      {actions && (
        <VStack space={2}>
          {actions}
        </VStack>
      )}
    </HStack>
  </Card>
);

// Empty States
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  iconColor = 'gray.300',
  size = 'md'
}) => (
  <Center flex={1} px={6}>
    <VStack alignItems="center" space={6}>
      <Box bg="gray.50" p={size === 'lg' ? 8 : 6} borderRadius="3xl">
        <Ionicons name={icon} size={size === 'lg' ? 64 : 48} color={iconColor} />
      </Box>
      <VStack alignItems="center" space={2}>
        <Heading fontSize={size === 'lg' ? 'xl' : 'lg'} fontWeight="bold" color="gray.800" textAlign="center">
          {title}
        </Heading>
        <Text fontSize="md" color="gray.500" textAlign="center" maxW={80}>
          {description}
        </Text>
      </VStack>
      {action && (
        <Box>
          {action}
        </Box>
      )}
    </VStack>
  </Center>
);

// List Components
export const ListItem = ({ 
  leftIcon, 
  leftElement,
  title, 
  subtitle, 
  rightElement, 
  onPress,
  isLast = false,
  variant = 'default'
}) => (
  <Pressable onPress={onPress} _pressed={{ opacity: 0.7 }}>
    <VStack>
      <HStack alignItems="center" space={4} py={4} px={variant === 'card' ? 0 : 4}>
        {leftIcon && (
          <Box bg="gray.100" p={2} borderRadius="lg">
            <Ionicons name={leftIcon} size={20} color="gray.600" />
          </Box>
        )}
        {leftElement}
        
        <VStack flex={1} space={1}>
          <Text fontSize="md" fontWeight="semibold" color="gray.800">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color="gray.500">
              {subtitle}
            </Text>
          )}
        </VStack>
        
        {rightElement}
      </HStack>
      {!isLast && <Divider />}
    </VStack>
  </Pressable>
);

// Notification Components
export const NotificationCard = ({ notification, onPress, onDismiss }) => (
  <Card bg="white" borderRadius="2xl" p={4} variant="outlined" mb={3}>
    <Pressable onPress={onPress}>
      <HStack alignItems="flex-start" space={3}>
        <Box bg={`${notification.type}.100`} p={2} borderRadius="lg">
          <Ionicons 
            name={notification.type === 'success' ? 'checkmark-circle' : 
                  notification.type === 'error' ? 'close-circle' : 
                  notification.type === 'warning' ? 'warning' : 'information-circle'} 
            size={20} 
            color={notification.type === 'success' ? '#22C55E' : 
                   notification.type === 'error' ? '#EF4444' :
                   notification.type === 'warning' ? '#F59E0B' : '#3B82F6'} 
          />
        </Box>
        
        <VStack flex={1} space={1}>
          <HStack alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold" color="gray.800">
              {notification.title}
            </Text>
            {onDismiss && (
              <IconButton
                icon={<Ionicons name="close" size={16} color="gray.400" />}
                onPress={onDismiss}
                size="sm"
                borderRadius="full"
                _pressed={{ bg: 'gray.100' }}
              />
            )}
          </HStack>
          
          <Text fontSize="sm" color="gray.600">
            {notification.message}
          </Text>
          
          <Text fontSize="xs" color="gray.400">
            {notification.time}
          </Text>
          
          {!notification.read && (
            <Circle size={2} bg="primary.500" position="absolute" top={0} right={0} />
          )}
        </VStack>
      </HStack>
    </Pressable>
  </Card>
);

// Form Components
export const FormSection = ({ title, children, icon }) => (
  <VStack space={4} mb={6}>
    <HStack alignItems="center" space={2}>
      {icon && (
        <Box bg="primary.100" p={2} borderRadius="lg">
          <Ionicons name={icon} size={16} color="#3B82F6" />
        </Box>
      )}
      <Heading fontSize="md" fontWeight="semibold" color="gray.800">
        {title}
      </Heading>
    </HStack>
    <VStack space={4}>
      {children}
    </VStack>
  </VStack>
);

export const FloatingActionButton = ({ 
  icon, 
  onPress, 
  colorScheme = 'primary',
  size = 'md',
  label
}) => (
  <Box position="absolute" bottom={6} right={6} zIndex={999}>
    <VStack alignItems="center" space={2}>
      {label && (
        <Box bg="gray.800" px={3} py={1} borderRadius="full">
          <Text fontSize="xs" color="white" fontWeight="medium">
            {label}
          </Text>
        </Box>
      )}
      <IconButton
        icon={<Ionicons name={icon} size={size === 'lg' ? 28 : 24} color="white" />}
        onPress={onPress}
        bg={`${colorScheme}.500`}
        borderRadius="full"
        size={size === 'lg' ? 16 : 14}
        shadow="lg"
        _pressed={{ bg: `${colorScheme}.600`, transform: [{ scale: 0.95 }] }}
      />
    </VStack>
  </Box>
); 