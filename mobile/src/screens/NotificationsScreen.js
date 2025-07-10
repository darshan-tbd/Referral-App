import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  ScrollView,
  Card,
  Badge,
  Button,
  IconButton,
  Select,
  useToast,
  Skeleton,
  Divider,
} from 'native-base';
import { RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/mockData';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all');
  
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getNotifications(user?.id);
      if (response.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to load notifications',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        toast.show({
          title: 'Success',
          description: 'All notifications marked as read',
          status: 'success',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'visa_status': return 'document-text';
      case 'documents': return 'folder';
      case 'referral': return 'people';
      case 'appointment': return 'calendar';
      case 'payment': return 'card';
      default: return 'information-circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.isRead;
    return notification.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card bg="white" borderRadius="xl" p={4} flex={1} mx={1}>
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
      </VStack>
    </Card>
  );

  const NotificationCard = ({ notification }) => (
    <Pressable onPress={() => {
      if (!notification.isRead) {
        handleMarkAsRead(notification.id);
      }
    }}>
      <Card 
        bg={notification.isRead ? 'white' : 'blue.50'} 
        borderRadius="xl" 
        p={4} 
        mb={3}
        borderWidth={notification.isRead ? 1 : 2}
        borderColor={notification.isRead ? 'gray.200' : 'blue.200'}
      >
        <HStack alignItems="center" space={4}>
          <Box 
            bg={`${getNotificationColor(notification.type)}.500`} 
            p={3} 
            borderRadius="full"
            position="relative"
          >
            <Ionicons 
              name={getNotificationIcon(notification.type)} 
              size={20} 
              color="white" 
            />
            {!notification.isRead && (
              <Box
                position="absolute"
                top={-1}
                right={-1}
                bg="red.500"
                w={3}
                h={3}
                borderRadius="full"
              />
            )}
          </Box>
          
          <VStack flex={1} space={1}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="md" fontWeight="bold" color="gray.700" flex={1}>
                {notification.title}
              </Text>
              <HStack alignItems="center" space={2}>
                {notification.priority === 'high' && (
                  <Badge colorScheme="red" variant="solid" borderRadius="full">
                    High
                  </Badge>
                )}
                <Text fontSize="xs" color="gray.400">
                  {formatDate(notification.createdAt)}
                </Text>
              </HStack>
            </HStack>
            
            <Text fontSize="sm" color="gray.600" numberOfLines={2}>
              {notification.message}
            </Text>
            
            <HStack alignItems="center" space={2} mt={1}>
              <Badge 
                colorScheme={getNotificationColor(notification.type)} 
                variant="subtle" 
                borderRadius="full"
              >
                {notification.category.replace('_', ' ')}
              </Badge>
              {notification.actionRequired && (
                <Badge colorScheme="orange" variant="solid" borderRadius="full">
                  Action Required
                </Badge>
              )}
            </HStack>
          </VStack>
        </HStack>
      </Card>
    </Pressable>
  );

  if (isLoading) {
    return (
      <Box flex={1} bg="gray.50" safeArea>
        <ScrollView>
          <VStack space={4} p={4}>
            <HStack space={3}>
              <Skeleton h="32" flex={1} borderRadius="xl" />
              <Skeleton h="32" flex={1} borderRadius="xl" />
              <Skeleton h="32" flex={1} borderRadius="xl" />
            </HStack>
            <Skeleton h="12" borderRadius="lg" />
            <Skeleton h="20" borderRadius="xl" />
            <Skeleton h="20" borderRadius="xl" />
            <Skeleton h="20" borderRadius="xl" />
          </VStack>
        </ScrollView>
      </Box>
    );
  }

  const categoryStats = {
    visa_status: notifications.filter(n => n.category === 'visa_status').length,
    documents: notifications.filter(n => n.category === 'documents').length,
    referral: notifications.filter(n => n.category === 'referral').length,
    appointment: notifications.filter(n => n.category === 'appointment').length,
  };

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
            <HStack alignItems="center" justifyContent="space-between">
              <VStack>
                <Text fontSize="xl" fontWeight="bold" color="white">
                  Notifications
                </Text>
                <Text fontSize="sm" color="primary.100">
                  {unreadCount} unread notifications
                </Text>
              </VStack>
              <HStack space={2}>
                <IconButton
                  icon={<Ionicons name="checkmark-done" size={20} color="white" />}
                  onPress={handleMarkAllAsRead}
                  bg="primary.400"
                  borderRadius="full"
                  isDisabled={unreadCount === 0}
                />
                <IconButton
                  icon={<Ionicons name="settings" size={20} color="white" />}
                  bg="primary.400"
                  borderRadius="full"
                />
              </HStack>
            </HStack>
          </Card>

          {/* Stats Cards */}
          <HStack space={2}>
            <StatCard
              title="Total"
              value={notifications.length}
              icon="notifications"
              color="blue"
            />
            <StatCard
              title="Unread"
              value={unreadCount}
              icon="notifications-circle"
              color="red"
            />
            <StatCard
              title="Important"
              value={notifications.filter(n => n.priority === 'high').length}
              icon="warning"
              color="orange"
            />
          </HStack>

          {/* Filter */}
          <VStack space={3}>
            <Select
              selectedValue={filterType}
              onValueChange={setFilterType}
              placeholder="Filter notifications"
              size="lg"
              borderRadius="lg"
              bg="white"
            >
              <Select.Item label="All Notifications" value="all" />
              <Select.Item label="Unread Only" value="unread" />
              <Select.Item label="Success" value="success" />
              <Select.Item label="Warnings" value="warning" />
              <Select.Item label="Information" value="info" />
            </Select>
          </VStack>

          {/* Notifications List */}
          <VStack space={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                {filterType === 'all' ? 'All Notifications' : 
                 filterType === 'unread' ? 'Unread Notifications' : 
                 `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Notifications`}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {filteredNotifications.length} items
              </Text>
            </HStack>

            {filteredNotifications.length === 0 ? (
              <Card bg="white" borderRadius="xl" p={6}>
                <VStack alignItems="center" space={4}>
                  <Box bg="gray.100" p={4} borderRadius="full">
                    <Ionicons name="notifications" size={32} color="gray" />
                  </Box>
                  <Text fontSize="lg" fontWeight="medium" color="gray.600" textAlign="center">
                    No notifications found
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    {filterType === 'unread' ? 
                      'All your notifications have been read' : 
                      'You have no notifications in this category'}
                  </Text>
                </VStack>
              </Card>
            ) : (
              <VStack space={0}>
                {filteredNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </VStack>
            )}
          </VStack>

          {/* Category Summary */}
          <Card bg="white" borderRadius="xl" p={4}>
            <VStack space={3}>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Notification Categories
              </Text>
              
              <VStack space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space={3}>
                    <Box bg="blue.500" p={2} borderRadius="full">
                      <Ionicons name="document-text" size={16} color="white" />
                    </Box>
                    <Text fontSize="sm" color="gray.600">
                      Visa Status Updates
                    </Text>
                  </HStack>
                  <Badge colorScheme="blue" variant="solid" borderRadius="full">
                    {categoryStats.visa_status}
                  </Badge>
                </HStack>
                
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space={3}>
                    <Box bg="green.500" p={2} borderRadius="full">
                      <Ionicons name="folder" size={16} color="white" />
                    </Box>
                    <Text fontSize="sm" color="gray.600">
                      Document Requests
                    </Text>
                  </HStack>
                  <Badge colorScheme="green" variant="solid" borderRadius="full">
                    {categoryStats.documents}
                  </Badge>
                </HStack>
                
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space={3}>
                    <Box bg="purple.500" p={2} borderRadius="full">
                      <Ionicons name="people" size={16} color="white" />
                    </Box>
                    <Text fontSize="sm" color="gray.600">
                      Referral Updates
                    </Text>
                  </HStack>
                  <Badge colorScheme="purple" variant="solid" borderRadius="full">
                    {categoryStats.referral}
                  </Badge>
                </HStack>
                
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space={3}>
                    <Box bg="orange.500" p={2} borderRadius="full">
                      <Ionicons name="calendar" size={16} color="white" />
                    </Box>
                    <Text fontSize="sm" color="gray.600">
                      Appointments
                    </Text>
                  </HStack>
                  <Badge colorScheme="orange" variant="solid" borderRadius="full">
                    {categoryStats.appointment}
                  </Badge>
                </HStack>
              </VStack>
            </VStack>
          </Card>
        </VStack>
      </ScrollView>


    </Box>
  );
};

export default NotificationsScreen; 