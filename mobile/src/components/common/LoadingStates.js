import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Skeleton,
  Spinner,
  Progress,
  Card,
  Button,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

// Full Screen Loading
export const FullScreenLoading = ({ message = 'Loading...' }) => (
  <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50" safeArea>
    <VStack alignItems="center" space={4}>
      <Spinner size="lg" color="primary.500" />
      <Text fontSize="md" color="gray.600" textAlign="center">
        {message}
      </Text>
    </VStack>
  </Box>
);

// Card Loading Skeleton
export const CardLoading = ({ count = 3, height = 20 }) => (
  <VStack space={3} p={4}>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} bg="white" borderRadius="xl" p={4}>
        <VStack space={3}>
          <HStack space={3}>
            <Skeleton size="10" borderRadius="full" />
            <VStack flex={1} space={2}>
              <Skeleton h="4" borderRadius="md" />
              <Skeleton h="3" w="3/4" borderRadius="md" />
            </VStack>
          </HStack>
          <Skeleton h={height} borderRadius="md" />
        </VStack>
      </Card>
    ))}
  </VStack>
);

// Stats Cards Loading
export const StatsCardsLoading = ({ count = 3 }) => (
  <HStack space={2} p={4}>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} bg="white" borderRadius="xl" p={4} flex={1} mx={1}>
        <VStack alignItems="center" space={3}>
          <Skeleton size="12" borderRadius="full" />
          <Skeleton h="6" w="12" borderRadius="md" />
          <Skeleton h="4" w="16" borderRadius="md" />
        </VStack>
      </Card>
    ))}
  </HStack>
);

// List Loading
export const ListLoading = ({ count = 5 }) => (
  <VStack space={3} p={4}>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} bg="white" borderRadius="xl" p={4}>
        <HStack alignItems="center" space={3}>
          <Skeleton size="10" borderRadius="full" />
          <VStack flex={1} space={2}>
            <Skeleton h="4" borderRadius="md" />
            <Skeleton h="3" w="2/3" borderRadius="md" />
          </VStack>
          <Skeleton h="8" w="16" borderRadius="md" />
        </HStack>
      </Card>
    ))}
  </VStack>
);

// Dashboard Loading
export const DashboardLoading = () => (
  <Box flex={1} bg="gray.50" safeArea>
    <VStack space={4} p={4}>
      {/* Header Skeleton */}
      <Card bg="gray.300" borderRadius="xl" p={6}>
        <HStack alignItems="center" space={4}>
          <Skeleton size="16" borderRadius="full" />
          <VStack flex={1} space={2}>
            <Skeleton h="6" borderRadius="md" />
            <Skeleton h="4" w="2/3" borderRadius="md" />
          </VStack>
        </HStack>
      </Card>

      {/* Stats Cards Skeleton */}
      <HStack space={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} bg="white" borderRadius="xl" p={4} flex={1} mx={1}>
            <VStack alignItems="center" space={3}>
              <Skeleton size="12" borderRadius="full" />
              <Skeleton h="6" w="12" borderRadius="md" />
              <Skeleton h="4" w="16" borderRadius="md" />
            </VStack>
          </Card>
        ))}
      </HStack>

      {/* Progress Card Skeleton */}
      <Card bg="white" borderRadius="xl" p={4}>
        <VStack space={3}>
          <HStack justifyContent="space-between">
            <Skeleton h="6" w="32" borderRadius="md" />
            <Skeleton h="6" w="16" borderRadius="md" />
          </HStack>
          <Skeleton h="2" borderRadius="full" />
          <HStack justifyContent="space-between">
            <Skeleton h="4" w="24" borderRadius="md" />
            <Skeleton h="4" w="16" borderRadius="md" />
          </HStack>
        </VStack>
      </Card>

      {/* Content Cards Skeleton */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} bg="white" borderRadius="xl" p={4}>
          <VStack space={3}>
            <HStack justifyContent="space-between">
              <Skeleton h="6" w="32" borderRadius="md" />
              <Skeleton h="6" w="16" borderRadius="md" />
            </HStack>
            <VStack space={2}>
              <Skeleton h="4" borderRadius="md" />
              <Skeleton h="4" w="4/5" borderRadius="md" />
              <Skeleton h="4" w="3/5" borderRadius="md" />
            </VStack>
          </VStack>
        </Card>
      ))}
    </VStack>
  </Box>
);

// Profile Loading
export const ProfileLoading = () => (
  <Box flex={1} bg="gray.50" safeArea>
    <VStack space={4} p={4}>
      {/* Profile Header Skeleton */}
      <Card bg="gray.300" borderRadius="xl" p={6}>
        <VStack alignItems="center" space={4}>
          <Skeleton size="24" borderRadius="full" />
          <VStack alignItems="center" space={2}>
            <Skeleton h="6" w="32" borderRadius="md" />
            <Skeleton h="4" w="24" borderRadius="md" />
          </VStack>
          <HStack space={2}>
            <Skeleton h="8" w="20" borderRadius="md" />
            <Skeleton h="8" w="20" borderRadius="md" />
          </HStack>
        </VStack>
      </Card>

      {/* Stats Cards Skeleton */}
      <HStack space={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} bg="white" borderRadius="xl" p={4} flex={1} mx={1}>
            <VStack alignItems="center" space={3}>
              <Skeleton size="12" borderRadius="full" />
              <Skeleton h="6" w="12" borderRadius="md" />
              <Skeleton h="4" w="16" borderRadius="md" />
            </VStack>
          </Card>
        ))}
      </HStack>

      {/* Info Cards Skeleton */}
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} bg="white" borderRadius="xl" p={4}>
          <VStack space={3}>
            <Skeleton h="6" w="32" borderRadius="md" />
            <VStack space={2}>
              {Array.from({ length: 4 }).map((_, rowIndex) => (
                <HStack key={rowIndex} alignItems="center" space={3}>
                  <Skeleton size="8" borderRadius="full" />
                  <VStack flex={1} space={1}>
                    <Skeleton h="3" w="16" borderRadius="md" />
                    <Skeleton h="4" w="24" borderRadius="md" />
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Card>
      ))}
    </VStack>
  </Box>
);

// Error State
export const ErrorState = ({ 
  title = 'Something went wrong', 
  description = 'Please try again later', 
  onRetry,
  icon = 'alert-circle'
}) => (
  <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50" safeArea p={6}>
    <VStack alignItems="center" space={4}>
      <Box bg="red.100" p={4} borderRadius="full">
        <Ionicons name={icon} size={48} color="#EF4444" />
      </Box>
      <Text fontSize="lg" fontWeight="bold" color="gray.700" textAlign="center">
        {title}
      </Text>
      <Text fontSize="md" color="gray.500" textAlign="center">
        {description}
      </Text>
      {onRetry && (
        <Button
          onPress={onRetry}
          colorScheme="red"
          variant="outline"
          leftIcon={<Ionicons name="refresh" size={16} />}
        >
          Try Again
        </Button>
      )}
    </VStack>
  </Box>
);

// Empty State
export const EmptyState = ({ 
  title = 'No data found', 
  description = 'There is no data to display', 
  action,
  icon = 'folder-open'
}) => (
  <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50" safeArea p={6}>
    <VStack alignItems="center" space={4}>
      <Box bg="gray.100" p={4} borderRadius="full">
        <Ionicons name={icon} size={48} color="#6B7280" />
      </Box>
      <Text fontSize="lg" fontWeight="bold" color="gray.700" textAlign="center">
        {title}
      </Text>
      <Text fontSize="md" color="gray.500" textAlign="center">
        {description}
      </Text>
      {action && action}
    </VStack>
  </Box>
);

// Loading with Progress
export const LoadingWithProgress = ({ 
  progress = 0, 
  title = 'Loading...', 
  description = 'Please wait while we load your data' 
}) => (
  <Box flex={1} justifyContent="center" alignItems="center" bg="gray.50" safeArea p={6}>
    <VStack alignItems="center" space={4} w="full">
      <Spinner size="lg" color="primary.500" />
      <Text fontSize="lg" fontWeight="bold" color="gray.700" textAlign="center">
        {title}
      </Text>
      <Text fontSize="md" color="gray.500" textAlign="center">
        {description}
      </Text>
      <VStack space={2} w="full">
        <Progress value={progress} colorScheme="primary" size="lg" borderRadius="full" />
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {Math.round(progress)}%
        </Text>
      </VStack>
    </VStack>
  </Box>
);

// Inline Loading
export const InlineLoading = ({ size = 'sm', message }) => (
  <HStack alignItems="center" space={2} py={2}>
    <Spinner size={size} color="primary.500" />
    {message && (
      <Text fontSize="sm" color="gray.600">
        {message}
      </Text>
    )}
  </HStack>
);

// Button Loading
export const ButtonLoading = ({ 
  isLoading = false, 
  loadingText = 'Loading...', 
  children,
  ...props 
}) => (
  <Button
    isLoading={isLoading}
    isLoadingText={loadingText}
    {...props}
  >
    {children}
  </Button>
);

export default {
  FullScreenLoading,
  CardLoading,
  StatsCardsLoading,
  ListLoading,
  DashboardLoading,
  ProfileLoading,
  ErrorState,
  EmptyState,
  LoadingWithProgress,
  InlineLoading,
  ButtonLoading,
}; 