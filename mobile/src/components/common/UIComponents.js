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
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

// Loading Components
export const LoadingScreen = ({ message = 'Loading...' }) => (
  <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50" safeArea>
    <VStack alignItems="center" space={4}>
      <Spinner size="lg" color="primary.500" />
      <Text fontSize="md" color="gray.600">
        {message}
      </Text>
    </VStack>
  </Box>
);

export const LoadingSpinner = ({ size = 'sm', color = 'primary.500' }) => (
  <Spinner size={size} color={color} />
);

export const SkeletonLoader = ({ lines = 3, height = 4 }) => (
  <VStack space={2}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton key={index} h={height} borderRadius="md" />
    ))}
  </VStack>
);

// Card Components
export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  bgColor,
  onPress
}) => (
  <Card 
    bg={bgColor || 'white'} 
    borderRadius="xl" 
    p={4} 
    flex={1} 
    mx={1}
    onPress={onPress}
  >
    <VStack alignItems="center" space={3}>
      <Box bg={`${color}.500`} p={3} borderRadius="full">
        <Ionicons name={icon} size={24} color="white" />
      </Box>
      <Text fontSize="xl" fontWeight="bold" color={`${color}.600`}>
        {value}
      </Text>
      <Text fontSize="sm" color="gray.600" textAlign="center">
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="xs" color="gray.500" textAlign="center">
          {subtitle}
        </Text>
      )}
    </VStack>
  </Card>
);

export const InfoCard = ({ title, children, actions }) => (
  <Card bg="white" borderRadius="xl" p={4}>
    <VStack space={3}>
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          {title}
        </Text>
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

// Status Components
export const StatusBadge = ({ status, variant = 'solid' }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'success':
        return 'green';
      case 'rejected':
      case 'failed':
      case 'error':
        return 'red';
      case 'pending':
      case 'warning':
        return 'orange';
      case 'in_progress':
      case 'processing':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Badge
      colorScheme={getStatusColor(status)}
      variant={variant}
      borderRadius="full"
    >
      {status}
    </Badge>
  );
};

export const PriorityBadge = ({ priority }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Badge
      colorScheme={getPriorityColor(priority)}
      variant="solid"
      borderRadius="full"
    >
      {priority}
    </Badge>
  );
};

// Progress Components
export const ProgressBar = ({ 
  value, 
  max = 100, 
  colorScheme = 'primary', 
  size = 'md',
  showPercentage = true
}) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <VStack space={2}>
      <Progress
        value={percentage}
        colorScheme={colorScheme}
        size={size}
        borderRadius="full"
      />
      {showPercentage && (
        <HStack justifyContent="space-between">
          <Text fontSize="sm" color="gray.500">
            {value} of {max}
          </Text>
          <Text fontSize="sm" color={`${colorScheme}.600`} fontWeight="medium">
            {percentage}%
          </Text>
        </HStack>
      )}
    </VStack>
  );
};

export const StageProgress = ({ stages, currentStage }) => (
  <VStack space={3}>
    {stages.map((stage, index) => {
      const isCompleted = stage.status === 'completed';
      const isActive = stage.status === 'in_progress';
      const isUpcoming = stage.status === 'pending';

      return (
        <HStack key={stage.id} alignItems="center" space={3}>
          <Box
            bg={isCompleted ? 'green.500' : isActive ? 'blue.500' : 'gray.300'}
            p={2}
            borderRadius="full"
            position="relative"
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
          <VStack flex={1}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {stage.name}
            </Text>
            {stage.date && (
              <Text fontSize="xs" color="gray.500">
                {isCompleted ? 'Completed' : 'Started'}: {stage.date}
              </Text>
            )}
          </VStack>
          <StatusBadge status={stage.status} />
        </HStack>
      );
    })}
  </VStack>
);

// Header Components
export const PageHeader = ({ title, subtitle, actions, bg = 'primary.500' }) => (
  <Card bg={bg} borderRadius="xl" p={6}>
    <HStack alignItems="center" justifyContent="space-between">
      <VStack>
        <Text fontSize="xl" fontWeight="bold" color="white">
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="sm" color="primary.100">
            {subtitle}
          </Text>
        )}
      </VStack>
      {actions && (
        <HStack space={2}>
          {actions}
        </HStack>
      )}
    </HStack>
  </Card>
);

// User Components
export const UserAvatar = ({ user, size = 'md', showBadge = false }) => (
  <Box position="relative">
    <Avatar
      source={{ uri: user?.avatar }}
      size={size}
      bg="primary.500"
    >
      {user?.name?.charAt(0)}
    </Avatar>
    {showBadge && (
      <Box
        position="absolute"
        bottom={0}
        right={0}
        bg="green.500"
        w={3}
        h={3}
        borderRadius="full"
        borderWidth={2}
        borderColor="white"
      />
    )}
  </Box>
);

export const UserCard = ({ user, actions }) => (
  <Card bg="white" borderRadius="xl" p={4}>
    <HStack alignItems="center" space={3}>
      <UserAvatar user={user} size="md" />
      <VStack flex={1}>
        <Text fontSize="md" fontWeight="bold" color="gray.700">
          {user?.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {user?.email}
        </Text>
        {user?.tier && (
          <Badge colorScheme="primary" variant="solid" borderRadius="full" alignSelf="flex-start">
            {user.tier}
          </Badge>
        )}
      </VStack>
      {actions && (
        <VStack space={1}>
          {actions}
        </VStack>
      )}
    </HStack>
  </Card>
);

// Empty State Components
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  iconColor = 'gray.400'
}) => (
  <Card bg="white" borderRadius="xl" p={6}>
    <VStack alignItems="center" space={4}>
      <Box bg="gray.100" p={4} borderRadius="full">
        <Ionicons name={icon} size={32} color={iconColor} />
      </Box>
      <Text fontSize="lg" fontWeight="medium" color="gray.600" textAlign="center">
        {title}
      </Text>
      <Text fontSize="sm" color="gray.500" textAlign="center">
        {description}
      </Text>
      {action && action}
    </VStack>
  </Card>
);

// Action Components
export const ActionButton = ({ 
  icon, 
  label, 
  onPress, 
  colorScheme = 'primary',
  variant = 'solid',
  size = 'md'
}) => (
  <Button
    onPress={onPress}
    colorScheme={colorScheme}
    variant={variant}
    size={size}
    leftIcon={<Ionicons name={icon} size={16} />}
  >
    {label}
  </Button>
);

export const QuickAction = ({ 
  title, 
  icon, 
  onPress, 
  color = 'primary',
  description
}) => (
  <Card bg="white" borderRadius="xl" p={4} flex={1} mx={1}>
    <VStack alignItems="center" space={3}>
      <Box bg={`${color}.500`} p={4} borderRadius="full">
        <Ionicons name={icon} size={28} color="white" />
      </Box>
      <Text fontSize="sm" fontWeight="medium" color="gray.700" textAlign="center">
        {title}
      </Text>
      {description && (
        <Text fontSize="xs" color="gray.500" textAlign="center">
          {description}
        </Text>
      )}
      <Button
        size="sm"
        variant="outline"
        colorScheme={color}
        onPress={onPress}
        borderRadius="full"
        px={4}
      >
        Open
      </Button>
    </VStack>
  </Card>
);

// Notification Components
export const NotificationIcon = ({ type, size = 20 }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'alert-circle';
      case 'info': return 'information-circle';
      default: return 'notifications';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      case 'info': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <Ionicons 
      name={getIcon(type)} 
      size={size} 
      color={getColor(type)} 
    />
  );
};

// List Components
export const ListItem = ({ 
  leftIcon, 
  title, 
  subtitle, 
  rightElement, 
  onPress,
  isLast = false
}) => (
  <Box>
    <HStack alignItems="center" space={3} py={3} px={4}>
      {leftIcon && (
        <Box bg="primary.100" p={2} borderRadius="full">
          {leftIcon}
        </Box>
      )}
      <VStack flex={1}>
        <Text fontSize="md" color="gray.700" fontWeight="medium">
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="sm" color="gray.500">
            {subtitle}
          </Text>
        )}
      </VStack>
      {rightElement && rightElement}
    </HStack>
    {!isLast && <Box bg="gray.100" h="0.5" mx={4} />}
  </Box>
);

export default {
  LoadingScreen,
  LoadingSpinner,
  SkeletonLoader,
  StatsCard,
  InfoCard,
  StatusBadge,
  PriorityBadge,
  ProgressBar,
  StageProgress,
  PageHeader,
  UserAvatar,
  UserCard,
  EmptyState,
  ActionButton,
  QuickAction,
  NotificationIcon,
  ListItem,
}; 