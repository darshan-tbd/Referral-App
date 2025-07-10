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
} from 'native-base';
import { Dimensions, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService, referralService, notificationService } from '../services/mockData';

const { width } = Dimensions.get('window');

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

  const StatCard = ({ title, value, subtitle, icon, color = 'primary', bgColor = 'primary.50' }) => (
    <Card bg={bgColor} borderRadius="xl" p={4} flex={1} mx={1}>
      <VStack alignItems="center" space={2}>
        <Box bg={`${color}.500`} p={3} borderRadius="full">
          <Ionicons name={icon} size={24} color="white" />
        </Box>
        <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`}>
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

  const QuickActionCard = ({ title, icon, onPress, color = 'primary' }) => (
    <Card bg="white" borderRadius="xl" p={4} flex={1} mx={1}>
      <VStack alignItems="center" space={3}>
        <Box bg={`${color}.500`} p={4} borderRadius="full">
          <Ionicons name={icon} size={28} color="white" />
        </Box>
        <Text fontSize="sm" fontWeight="medium" color="gray.700" textAlign="center">
          {title}
        </Text>
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

  const RecentActivityCard = ({ activity }) => (
    <Card bg="white" borderRadius="lg" p={4} mb={3}>
      <HStack alignItems="center" space={3}>
        <Box bg="primary.500" p={2} borderRadius="full">
          <Ionicons name="time" size={16} color="white" />
        </Box>
        <VStack flex={1}>
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            {activity.title}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {activity.message}
          </Text>
          <Text fontSize="xs" color="gray.400" mt={1}>
            {activity.time}
          </Text>
        </VStack>
      </HStack>
    </Card>
  );

  if (isLoading) {
    return (
      <Box flex={1} bg="gray.50" safeArea>
        <ScrollView>
          <VStack space={4} p={4}>
            <Skeleton h="20" borderRadius="xl" />
            <HStack space={3}>
              <Skeleton h="32" flex={1} borderRadius="xl" />
              <Skeleton h="32" flex={1} borderRadius="xl" />
            </HStack>
            <HStack space={3}>
              <Skeleton h="32" flex={1} borderRadius="xl" />
              <Skeleton h="32" flex={1} borderRadius="xl" />
            </HStack>
            <Skeleton h="40" borderRadius="xl" />
            <Skeleton h="60" borderRadius="xl" />
          </VStack>
        </ScrollView>
      </Box>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentReferrals = dashboardData?.recentReferrals || [];
  const recentNotifications = dashboardData?.recentNotifications || [];

  return (
    <Box flex={1} bg="gray.50" safeArea>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <VStack space={4} p={4}>
          {/* Header */}
          <Card bg="primary.500" borderRadius="xl" p={6}>
            <HStack alignItems="center" space={4}>
              <Avatar
                source={{ uri: user?.avatar }}
                size="lg"
                bg="white"
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <VStack flex={1}>
                <Text fontSize="xl" fontWeight="bold" color="white">
                  Welcome back, {user?.name}!
                </Text>
                <Text fontSize="sm" color="primary.100">
                  {user?.currentStage || 'Application in progress'}
                </Text>
                <HStack alignItems="center" space={2} mt={2}>
                  <Badge colorScheme="success" variant="solid" borderRadius="full">
                    {user?.tier || 'Gold'}
                  </Badge>
                  <Text fontSize="xs" color="primary.100">
                    {user?.points || 0} points
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </Card>

          {/* Stats Overview */}
          <VStack space={3}>
            <Text fontSize="lg" fontWeight="bold" color="gray.700">
              Your Statistics
            </Text>
            
            <HStack space={2}>
              <StatCard
                title="Total Applications"
                value={stats.totalApplications || 0}
                subtitle="All time"
                icon="document-text"
                color="blue"
                bgColor="blue.50"
              />
              <StatCard
                title="Approved"
                value={stats.approvedApplications || 0}
                subtitle={`${stats.successRate || 0}% success rate`}
                icon="checkmark-circle"
                color="green"
                bgColor="green.50"
              />
            </HStack>
            
            <HStack space={2}>
              <StatCard
                title="Referrals"
                value={stats.totalReferrals || 0}
                subtitle={`${stats.successfulReferrals || 0} successful`}
                icon="people"
                color="purple"
                bgColor="purple.50"
              />
              <StatCard
                title="Commission"
                value={`$${stats.totalCommission || 0}`}
                subtitle={`$${stats.thisMonthCommission || 0} this month`}
                icon="cash"
                color="orange"
                bgColor="orange.50"
              />
            </HStack>
          </VStack>

          {/* Progress Overview */}
          <Card bg="white" borderRadius="xl" p={4}>
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  Application Progress
                </Text>
                <Badge colorScheme="primary" variant="subtle" borderRadius="full">
                  Stage {user?.progress?.current || 1}/5
                </Badge>
              </HStack>
              
              <Progress
                value={(user?.progress?.current || 1) * 20}
                colorScheme="primary"
                size="lg"
                borderRadius="full"
              />
              
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.600">
                  {user?.currentStage || 'Initial Enquiry'}
                </Text>
                <Text fontSize="sm" color="primary.600" fontWeight="medium">
                  {(user?.progress?.current || 1) * 20}% Complete
                </Text>
              </HStack>
            </VStack>
          </Card>

          {/* Quick Actions */}
          <VStack space={3}>
            <Text fontSize="lg" fontWeight="bold" color="gray.700">
              Quick Actions
            </Text>
            
            <HStack space={2}>
              <QuickActionCard
                title="Track Progress"
                icon="bar-chart"
                onPress={() => navigation.navigate('Progress')}
                color="blue"
              />
              <QuickActionCard
                title="New Referral"
                icon="person-add"
                onPress={() => navigation.navigate('Referrals')}
                color="green"
              />
            </HStack>
            
            <HStack space={2}>
              <QuickActionCard
                title="Notifications"
                icon="notifications"
                onPress={() => navigation.navigate('Notifications')}
                color="purple"
              />
              <QuickActionCard
                title="My Profile"
                icon="person"
                onPress={() => navigation.navigate('Profile')}
                color="orange"
              />
            </HStack>
          </VStack>

          {/* Recent Referrals */}
          {recentReferrals.length > 0 && (
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  Recent Referrals
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  colorScheme="primary"
                  onPress={() => navigation.navigate('Referrals')}
                >
                  View All
                </Button>
              </HStack>
              
              <VStack space={2}>
                {recentReferrals.slice(0, 3).map((referral) => (
                  <Card key={referral.id} bg="white" borderRadius="lg" p={4}>
                    <HStack alignItems="center" space={3}>
                      <Box bg="primary.500" p={2} borderRadius="full">
                        <Ionicons name="person" size={16} color="white" />
                      </Box>
                      <VStack flex={1}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          {referral.refereeName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {referral.visaType} - {referral.country}
                        </Text>
                        <Text fontSize="xs" color="gray.400" mt={1}>
                          {referral.submissionDate}
                        </Text>
                      </VStack>
                      <Badge
                        colorScheme={
                          referral.status === 'approved' ? 'green' :
                          referral.status === 'rejected' ? 'red' :
                          referral.status === 'in_progress' ? 'blue' : 'gray'
                        }
                        variant="solid"
                        borderRadius="full"
                      >
                        {referral.status}
                      </Badge>
                    </HStack>
                  </Card>
                ))}
              </VStack>
            </VStack>
          )}

          {/* Recent Notifications */}
          {recentNotifications.length > 0 && (
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  Recent Updates
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  colorScheme="primary"
                  onPress={() => navigation.navigate('Notifications')}
                >
                  View All
                </Button>
              </HStack>
              
              <VStack space={2}>
                {recentNotifications.slice(0, 3).map((notification) => (
                  <Card key={notification.id} bg="white" borderRadius="lg" p={4}>
                    <HStack alignItems="center" space={3}>
                      <Box 
                        bg={
                          notification.type === 'success' ? 'green.500' :
                          notification.type === 'warning' ? 'orange.500' :
                          notification.type === 'error' ? 'red.500' : 'blue.500'
                        }
                        p={2}
                        borderRadius="full"
                      >
                        <Ionicons 
                          name={
                            notification.type === 'success' ? 'checkmark-circle' :
                            notification.type === 'warning' ? 'warning' :
                            notification.type === 'error' ? 'alert-circle' : 'information-circle'
                          }
                          size={16}
                          color="white"
                        />
                      </Box>
                      <VStack flex={1}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          {notification.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500" numberOfLines={2}>
                          {notification.message}
                        </Text>
                        <Text fontSize="xs" color="gray.400" mt={1}>
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                      {!notification.isRead && (
                        <Box w={2} h={2} bg="primary.500" borderRadius="full" />
                      )}
                    </HStack>
                  </Card>
                ))}
              </VStack>
            </VStack>
          )}

          {/* Support Section */}
          <Card bg="gray.100" borderRadius="xl" p={4}>
            <VStack space={3} alignItems="center">
              <Box bg="primary.500" p={3} borderRadius="full">
                <Ionicons name="help-circle" size={24} color="white" />
              </Box>
              <Text fontSize="md" fontWeight="medium" color="gray.700" textAlign="center">
                Need Help?
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Our support team is here to assist you with your visa application.
              </Text>
              <HStack space={2}>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="primary"
                  leftIcon={<Ionicons name="call" size={16} />}
                  onPress={() => Alert.alert('Support', 'Call: +1-800-VISA-HELP')}
                >
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="primary"
                  leftIcon={<Ionicons name="mail" size={16} />}
                  onPress={() => Alert.alert('Support', 'Email: support@visaconsultancy.com')}
                >
                  Email
                </Button>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default DashboardScreen; 