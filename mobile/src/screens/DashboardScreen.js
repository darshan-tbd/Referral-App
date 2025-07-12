import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  ScrollView,
  Card,
  Avatar,
  Badge,
  Button,
  IconButton,
  Divider,
  Progress,
  useToast,
  Skeleton,
  StatusBar,
  Heading,
  Center,
  Pressable,
  Circle,
  Flex,
} from 'native-base';
import { Dimensions, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService, referralService, notificationService, getAvatarInitials } from '../services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MetricCard, 
  ActionCard, 
  ProgressIndicator, 
  StatusBadge, 
  EmptyState,
  UserAvatar,
  LoadingScreen,
  SkeletonLoader,
  PageHeader,
  InfoCard,
  ListItem,
  NotificationCard 
} from '../components/common/UIComponents';

const { width, height } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getDashboardData(user?.id);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to load dashboard data',
        status: 'error',
        duration: 3000,
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const WelcomeCard = ({ user }) => (
    <Box position="relative" borderRadius="3xl" overflow="hidden" mb={6}>
      <LinearGradient
        colors={['#3B82F6', '#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24 }}
      >
        {/* Enhanced floating design elements */}
        <Circle size="80" bg="white" opacity={0.08} position="absolute" top={-20} right={-20} />
        <Circle size="60" bg="white" opacity={0.06} position="absolute" bottom={-10} left={-10} />
        <Circle size="40" bg="white" opacity={0.04} position="absolute" top={20} left={20} />
        
        <VStack space={5}>
          <HStack alignItems="center" space={4}>
            <Box position="relative">
              <UserAvatar 
                user={user} 
                size="xl" 
                showBadge={user?.isOnline} 
                variant="elevated"
              />
              <Box position="absolute" top={-2} right={-2}>
                <Circle size={6} bg="success.500" borderWidth={2} borderColor="white">
                  <Text fontSize="xs" fontWeight="bold" color="white">
                    {user?.level || 'PRO'}
                  </Text>
                </Circle>
              </Box>
            </Box>
            
            <VStack flex={1} space={1}>
              <HStack alignItems="center" justifyContent="space-between">
                <VStack>
                  <Text fontSize="sm" color="white" opacity={0.9}>
                    Welcome back,
                  </Text>
                  <Heading fontSize="xl" fontWeight="bold" color="white">
                    {user?.name?.split(' ')[0] || 'User'}
                  </Heading>
                </VStack>
                <VStack alignItems="flex-end">
                  <Badge 
                    colorScheme="warning" 
                    variant="solid" 
                    borderRadius="full"
                    px={3}
                    py={1}
                  >
                    {user?.tier || 'Gold'}
                  </Badge>
                </VStack>
              </HStack>
            </VStack>
          </HStack>
          
          <HStack alignItems="center" space={4}>
            <HStack alignItems="center" space={2}>
              <Circle size={3} bg="success.400" />
              <Text fontSize="sm" color="white" opacity={0.9}>
                {user?.currentStage || 'Application in progress'}
              </Text>
            </HStack>
            <HStack alignItems="center" space={2}>
              <Ionicons name="trophy" size={16} color="white" />
              <Text fontSize="sm" color="white" fontWeight="medium">
                {user?.points || 0} pts
              </Text>
            </HStack>
          </HStack>
          
          {/* Progress indicator */}
          <VStack space={2}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="sm" color="white" opacity={0.9}>
                Overall Progress
              </Text>
              <Text fontSize="sm" color="white" fontWeight="bold">
                {((user?.progress?.current || 1) * 20)}%
              </Text>
            </HStack>
            <Progress
              value={(user?.progress?.current || 1) * 20}
              colorScheme="warning"
              size="md"
              borderRadius="full"
              bg="white"
              bgOpacity={0.2}
            />
          </VStack>
        </VStack>
      </LinearGradient>
    </Box>
  );

  const MetricsOverview = ({ stats }) => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800">
          Performance Overview
        </Heading>
        <Pressable onPress={() => navigation.navigate('Progress')}>
          <HStack alignItems="center" space={1}>
            <Text fontSize="sm" color="primary.600" fontWeight="semibold">
              View Details
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </HStack>
        </Pressable>
      </HStack>
      
      <VStack space={3}>
        <HStack space={3}>
          <MetricCard
            title="Total Referrals"
            value={stats.totalReferrals || 0}
            subtitle="All time"
            icon="people"
            color="primary"
            isHighlighted={true}
            trend={{ positive: true, value: '+12%' }}
          />
          <MetricCard
            title="Success Rate"
            value={`${stats.successRate || 0}%`}
            subtitle="This month"
            icon="checkmark-circle"
            color="success"
            trend={{ positive: true, value: '+5%' }}
          />
        </HStack>
        
        <HStack space={3}>
          <MetricCard
            title="Total Earnings"
            value={`$${stats.totalEarnings || 0}`}
            subtitle="All time"
            icon="cash"
            color="success"
            trend={{ positive: true, value: '+8%' }}
          />
          <MetricCard
            title="Pending"
            value={stats.pendingReferrals || 0}
            subtitle="Under review"
            icon="time"
            color="warning"
          />
        </HStack>
      </VStack>
    </VStack>
  );

  const QuickActions = () => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800">
          Quick Actions
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Get things done
        </Text>
      </HStack>
      
      <VStack space={3}>
        <HStack space={3}>
          <ActionCard
            title="New Referral"
            description="Refer someone"
            icon="person-add"
            color="primary"
            onPress={() => navigation.navigate('Referrals')}
          />
          <ActionCard
            title="View Progress"
            description="Track status"
            icon="analytics"
            color="success"
            onPress={() => navigation.navigate('Progress')}
          />
        </HStack>
        <HStack space={3}>
          <ActionCard
            title="Notifications"
            description="Stay updated"
            icon="notifications"
            color="warning"
            badge={3}
            onPress={() => navigation.navigate('Notifications')}
          />
          <ActionCard
            title="Profile"
            description="Manage account"
            icon="person"
            color="primary"
            onPress={() => navigation.navigate('Profile')}
          />
        </HStack>
      </VStack>
    </VStack>
  );

  const ApplicationProgress = ({ user }) => (
    <InfoCard
      title="Application Progress"
      icon="clipboard"
      color="primary"
      actions={[
        <Pressable key="view" onPress={() => navigation.navigate('Progress')}>
          <HStack alignItems="center" space={1}>
            <Text fontSize="sm" color="primary.600" fontWeight="semibold">
              View Details
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </HStack>
        </Pressable>
      ]}
    >
      <VStack space={4}>
        <HStack alignItems="center" justifyContent="space-between">
          <VStack>
            <Text fontSize="md" fontWeight="semibold" color="gray.800">
              {user?.currentStage || 'Initial Enquiry'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Current stage of your application
            </Text>
          </VStack>
          <Badge 
            colorScheme="primary" 
            variant="subtle" 
            borderRadius="full"
            px={3}
            py={1}
          >
            Stage {user?.progress?.current || 1} of 5
          </Badge>
        </HStack>
        
        <ProgressIndicator
          value={(user?.progress?.current || 1) * 20}
          max={100}
          colorScheme="primary"
          size="lg"
          showPercentage={true}
          label="Progress"
        />
        
        <HStack alignItems="center" space={2}>
          <Circle size={3} bg="primary.500" />
          <Text fontSize="sm" color="gray.600">
            Next: {user?.progress?.nextStage || 'Document Verification'}
          </Text>
        </HStack>
      </VStack>
    </InfoCard>
  );

  const RecentActivity = ({ recentReferrals }) => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800">
          Recent Activity
        </Heading>
        <Pressable onPress={() => navigation.navigate('Referrals')}>
          <HStack alignItems="center" space={1}>
            <Text fontSize="sm" color="primary.600" fontWeight="semibold">
              View All
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </HStack>
        </Pressable>
      </HStack>
      
      <Card bg="white" borderRadius="2xl" p={0} variant="outlined">
        {recentReferrals.length > 0 ? (
          <VStack space={0}>
            {recentReferrals.slice(0, 3).map((referral, index) => (
              <ListItem
                key={referral.id}
                leftElement={
                  <Box bg="primary.100" p={3} borderRadius="xl">
                    <Ionicons name="person-outline" size={20} color="#3B82F6" />
                  </Box>
                }
                title={referral.refereeName}
                subtitle={`${referral.visaType} • ${referral.country} • ${new Date(referral.submissionDate).toLocaleDateString()}`}
                rightElement={
                  <StatusBadge 
                    status={referral.status} 
                    variant="solid" 
                    size="sm"
                  />
                }
                onPress={() => navigation.navigate('Referrals')}
                isLast={index === recentReferrals.slice(0, 3).length - 1}
                variant="card"
              />
            ))}
          </VStack>
        ) : (
          <EmptyState
            icon="people-outline"
            title="No recent referrals"
            description="Start by referring someone today to see activity here"
            size="sm"
            action={
              <Button
                size="sm"
                colorScheme="primary"
                onPress={() => navigation.navigate('Referrals')}
                borderRadius="xl"
              >
                Add Referral
              </Button>
            }
          />
        )}
      </Card>
    </VStack>
  );

  const RecentNotifications = ({ notifications }) => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800">
          Recent Updates
        </Heading>
        <Pressable onPress={() => navigation.navigate('Notifications')}>
          <HStack alignItems="center" space={1}>
            <Text fontSize="sm" color="primary.600" fontWeight="semibold">
              View All
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </HStack>
        </Pressable>
      </HStack>
      
      <VStack space={3}>
        {notifications.slice(0, 3).map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onPress={() => navigation.navigate('Notifications')}
          />
        ))}
      </VStack>
    </VStack>
  );

  const LoadingSkeleton = () => (
    <Box flex={1} bg="background.secondary" safeArea>
      <VStack space={6} p={6}>
        <SkeletonLoader lines={1} height={12} />
        <SkeletonLoader lines={2} height={8} />
        <HStack space={3}>
          <SkeletonLoader lines={1} height={24} />
          <SkeletonLoader lines={1} height={24} />
        </HStack>
        <HStack space={3}>
          <SkeletonLoader lines={1} height={24} />
          <SkeletonLoader lines={1} height={24} />
        </HStack>
        <SkeletonLoader lines={1} height={16} />
        <SkeletonLoader lines={3} height={6} />
      </VStack>
    </Box>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stats = dashboardData?.stats || {};
  const recentReferrals = dashboardData?.recentReferrals || [];
  const recentNotifications = dashboardData?.recentNotifications || [];

  return (
    <Box flex={1} bg="background.secondary">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <VStack space={6} p={6} safeAreaTop>
          {/* Welcome Section */}
          <WelcomeCard user={user} />

          {/* Metrics Overview */}
          <MetricsOverview stats={stats} />

          {/* Application Progress */}
          <ApplicationProgress user={user} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <RecentActivity recentReferrals={recentReferrals} />

          {/* Recent Notifications */}
          {recentNotifications.length > 0 && (
            <RecentNotifications notifications={recentNotifications} />
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default DashboardScreen; 