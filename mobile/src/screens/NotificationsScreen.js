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
  Pressable,
  Modal,
  Switch,
  FormControl,
  Center,
  Spinner,
  Heading,
  Divider,
  StatusBar,
  Circle,
} from 'native-base';
import { RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/mockData';
import { 
  PageHeader,
  MetricCard,
  NotificationCard,
  EmptyState,
  SkeletonLoader,
  StatusBadge,
  FloatingActionButton,
  InfoCard,
  FormSection
} from '../components/common/UIComponents';

const { width: screenWidth } = Dimensions.get('window');

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false,
  });
  
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
        placement: 'top',
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
          title: 'All notifications marked as read',
          description: 'Your notification list has been updated',
          status: 'success',
          duration: 2000,
          placement: 'top',
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        status: 'error',
        duration: 3000,
        placement: 'top',
      });
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
        toast.show({
          title: 'Notification deleted',
          description: 'The notification has been removed',
          status: 'success',
          duration: 2000,
          placement: 'top',
        });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to delete notification',
        status: 'error',
        duration: 3000,
        placement: 'top',
      });
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
  const todayCount = notifications.filter(n => formatDate(n.createdAt) === 'Today').length;

  const handleSaveSettings = async () => {
    try {
      // Mock API call to save settings
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowSettings(false);
      toast.show({
        title: 'Settings updated',
        description: 'Your notification preferences have been saved',
        status: 'success',
        duration: 2000,
        placement: 'top',
      });
    } catch (error) {
      toast.show({
        title: 'Error',
        description: 'Failed to save settings',
        status: 'error',
        duration: 3000,
        placement: 'top',
      });
    }
  };



  // Improved Overview Cards with better responsive layout
  const NotificationOverview = () => (
    <Card bg="white" borderRadius="2xl" p={4} shadow="sm" variant="elevated">
      <VStack space={3}>
        <HStack alignItems="center" justifyContent="space-between">
          <VStack>
            <Heading fontSize="md" fontWeight="bold" color="gray.800" numberOfLines={1}>
              Notification Overview
            </Heading>
            <Text fontSize="xs" color="gray.500" numberOfLines={1}>
              Your activity summary
            </Text>
          </VStack>
          <HStack space={2}>
            {unreadCount > 0 && (
              <Pressable onPress={handleMarkAllAsRead}>
                <Box bg="primary.100" p={1.5} borderRadius="lg">
                  <Ionicons name="checkmark-done" size={16} color="#3B82F6" />
                </Box>
              </Pressable>
            )}
            <Pressable onPress={() => setShowSettings(true)}>
              <Box bg="gray.100" p={1.5} borderRadius="lg">
                <Ionicons name="settings" size={16} color="gray.600" />
              </Box>
            </Pressable>
          </HStack>
        </HStack>
        
        {/* Compact metric cards in single row */}
        <HStack space={2} justifyContent="space-between">
          <Box flex={1}>
            <MetricCard
              title="Total"
              value={notifications.length}
              icon="notifications-outline"
              color="primary"
              size="xs"
            />
          </Box>
          <Box flex={1}>
            <MetricCard
              title="Unread"
              value={unreadCount}
              icon="notifications-off-outline"
              color="error"
              size="xs"
              trend={unreadCount > 0 ? { positive: false, value: `${unreadCount}` } : undefined}
            />
          </Box>
          <Box flex={1}>
            <MetricCard
              title="Today"
              value={todayCount}
              icon="today"
              color="success"
              size="xs"
              trend={todayCount > 0 ? { positive: true, value: `${todayCount}` } : undefined}
            />
          </Box>
        </HStack>
      </VStack>
    </Card>
  );

  // Enhanced Filter Section
  const FilterSection = () => (
    <Card bg="white" borderRadius="2xl" p={4} shadow="sm" variant="elevated">
      <VStack space={3}>
        <HStack alignItems="center" space={3}>
          <Box bg="blue.100" p={2} borderRadius="lg">
            <Ionicons name="filter" size={16} color="#3B82F6" />
          </Box>
          <Heading fontSize="sm" fontWeight="semibold" color="gray.800" numberOfLines={1}>
            Filter Notifications
          </Heading>
        </HStack>
        
        <VStack space={3}>
          {/* Filter Dropdown */}
          <HStack space={3} alignItems="center">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" minW="16">
              Type:
            </Text>
            <Box flex={1}>
              <Select
                selectedValue={filterType}
                onValueChange={setFilterType}
                bg="gray.50"
                borderWidth={1}
                borderColor="gray.200"
                borderRadius="xl"
                fontSize="sm"
                _selectedItem={{
                  bg: "primary.100",
                  endIcon: <Ionicons name="checkmark" size={16} color="primary.600" />,
                }}
              >
                <Select.Item label="All Notifications" value="all" />
                <Select.Item label="Unread Only" value="unread" />
                <Select.Item label="Success" value="success" />
                <Select.Item label="Warning" value="warning" />
                <Select.Item label="Error" value="error" />
                <Select.Item label="Info" value="info" />
              </Select>
            </Box>
          </HStack>
          
          {/* Results Count */}
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="xs" color="gray.500">
              {filteredNotifications.length} of {notifications.length} notifications
            </Text>
            {filterType !== 'all' && (
              <Pressable onPress={() => setFilterType('all')}>
                <Text fontSize="xs" color="primary.600" fontWeight="medium">
                  Clear filter
                </Text>
              </Pressable>
            )}
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );

  // Enhanced Notifications List with better card design
  const NotificationsList = () => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800" numberOfLines={1}>
          Recent Notifications
        </Heading>
        <Text fontSize="sm" color="gray.500" numberOfLines={1}>
          {filteredNotifications.length} items
        </Text>
      </HStack>
      
      {filteredNotifications.length > 0 ? (
        <VStack space={3}>
          {filteredNotifications.map((notification, index) => (
            <Card 
              key={notification.id} 
              bg="white" 
              borderRadius="2xl" 
              p={4} 
              shadow="sm" 
              variant="elevated"
              borderLeftWidth={!notification.isRead ? 3 : 0}
              borderLeftColor={!notification.isRead ? "primary.500" : "transparent"}
            >
              <VStack space={3}>
                {/* Header with icon and status */}
                <HStack alignItems="flex-start" justifyContent="space-between">
                  <HStack alignItems="flex-start" space={3} flex={1}>
                    <Box 
                      bg={`${notification.type || 'primary'}.100`} 
                      p={2} 
                      borderRadius="xl"
                      mt={1}
                    >
                      <Ionicons 
                        name={
                          notification.type === 'success' ? 'checkmark-circle' :
                          notification.type === 'warning' ? 'warning' :
                          notification.type === 'error' ? 'close-circle' :
                          'information-circle'
                        } 
                        size={18} 
                        color={
                          notification.type === 'success' ? '#22C55E' :
                          notification.type === 'warning' ? '#F59E0B' :
                          notification.type === 'error' ? '#EF4444' :
                          '#3B82F6'
                        }
                      />
                    </Box>
                    <VStack flex={1} space={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800" numberOfLines={2}>
                        {notification.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600" numberOfLines={3}>
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color="gray.400" numberOfLines={1}>
                        {formatDate(notification.createdAt)}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  {/* Status indicator and actions */}
                  <VStack alignItems="flex-end" space={2}>
                    {!notification.isRead && (
                      <Circle size={3} bg="primary.500" />
                    )}
                    <Badge
                      colorScheme={
                        notification.type === 'success' ? 'success' :
                        notification.type === 'warning' ? 'warning' :
                        notification.type === 'error' ? 'error' :
                        'primary'
                      }
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      py={0.5}
                    >
                      <Text fontSize="xs" fontWeight="medium">
                        {notification.type || 'info'}
                      </Text>
                    </Badge>
                  </VStack>
                </HStack>
                
                {/* Actions */}
                <Divider />
                <HStack justifyContent="space-between" alignItems="center">
                  <HStack space={4}>
                    {!notification.isRead && (
                      <Pressable 
                        onPress={() => handleMarkAsRead(notification.id)}
                        _pressed={{ opacity: 0.7 }}
                      >
                        <HStack alignItems="center" space={1}>
                          <Ionicons name="checkmark" size={16} color="#3B82F6" />
                          <Text fontSize="sm" color="primary.600" fontWeight="medium">
                            Mark Read
                          </Text>
                        </HStack>
                      </Pressable>
                    )}
                    <Pressable 
                      onPress={() => handleDeleteNotification(notification.id)}
                      _pressed={{ opacity: 0.7 }}
                    >
                      <HStack alignItems="center" space={1}>
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text fontSize="sm" color="error.600" fontWeight="medium">
                          Delete
                        </Text>
                      </HStack>
                    </Pressable>
                  </HStack>
                  <Text fontSize="xs" color="gray.400">
                    ID: {notification.id}
                  </Text>
                </HStack>
              </VStack>
            </Card>
          ))}
        </VStack>
      ) : (
        <EmptyState
          icon="notifications-off-outline"
          title="No notifications found"
          description={
            filterType === 'all' 
              ? "You're all caught up! No new notifications at the moment." 
              : `No ${filterType} notifications available. Try changing your filter.`
          }
          size="lg"
          action={
            filterType !== 'all' && (
              <Button
                onPress={() => setFilterType('all')}
                colorScheme="primary"
                variant="outline"
                borderRadius="xl"
              >
                Show All Notifications
              </Button>
            )
          }
        />
      )}
    </VStack>
  );

  const LoadingSkeleton = () => (
    <Box flex={1} bg="background.secondary" safeArea>
      <VStack space={6} p={6}>
        <SkeletonLoader lines={1} height={12} />
        <HStack space={3}>
          <SkeletonLoader lines={1} height={20} />
          <SkeletonLoader lines={1} height={20} />
          <SkeletonLoader lines={1} height={20} />
        </HStack>
        <SkeletonLoader lines={1} height={16} />
        <SkeletonLoader lines={4} height={20} />
        <SkeletonLoader lines={4} height={20} />
        <SkeletonLoader lines={4} height={20} />
      </VStack>
    </Box>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box flex={1} bg="background.secondary">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <VStack space={6} p={6} safeAreaTop>
          {/* Enhanced Header */}
          <Box position="relative" borderBottomRadius="3xl" overflow="hidden">
            <PageHeader
              title="Notifications"
              subtitle="Stay updated with your activities"
              variant="gradient"
              actions={[
                <IconButton
                  key="settings"
                  icon={<Ionicons name="settings-outline" size={20} color="white" />}
                  onPress={() => setShowSettings(true)}
                  bg="white"
                  bgOpacity={0.2}
                  borderRadius="full"
                  _pressed={{ bg: 'white', bgOpacity: 0.3 }}
                />,
                unreadCount > 0 && (
                  <IconButton
                    key="mark-all"
                    icon={<Ionicons name="checkmark-done-outline" size={20} color="white" />}
                    onPress={handleMarkAllAsRead}
                    bg="white"
                    bgOpacity={0.2}
                    borderRadius="full"
                    _pressed={{ bg: 'white', bgOpacity: 0.3 }}
                  />
                ),
              ].filter(Boolean)}
            />
          </Box>

          {/* Notification Overview */}
          <NotificationOverview />

          {/* Filter Section */}
          <FilterSection />

          {/* Notifications List */}
          <NotificationsList />
        </VStack>
      </ScrollView>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} size="lg">
        <Modal.Content maxWidth="400px" borderRadius="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0} pb={2}>
            <HStack alignItems="center" space={2}>
              <Box bg="primary.100" p={2} borderRadius="lg">
                <Ionicons name="settings" size={20} color="#3B82F6" />
              </Box>
              <Heading fontSize="lg" fontWeight="bold" color="gray.800">
                Notification Settings
              </Heading>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <FormSection title="Notification Preferences" icon="notifications">
              <VStack space={4}>
                <FormControl>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800" numberOfLines={1}>
                        Push Notifications
                      </Text>
                      <Text fontSize="sm" color="gray.500" numberOfLines={2}>
                        Receive notifications on your device
                      </Text>
                    </VStack>
                    <Switch
                      value={settings.push}
                      onValueChange={(value) => setSettings({...settings, push: value})}
                      colorScheme="primary"
                    />
                  </HStack>
                </FormControl>
                
                <Divider />
                
                <FormControl>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800" numberOfLines={1}>
                        Email Notifications
                      </Text>
                      <Text fontSize="sm" color="gray.500" numberOfLines={2}>
                        Receive notifications via email
                      </Text>
                    </VStack>
                    <Switch
                      value={settings.email}
                      onValueChange={(value) => setSettings({...settings, email: value})}
                      colorScheme="primary"
                    />
                  </HStack>
                </FormControl>
                
                <Divider />
                
                <FormControl>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800" numberOfLines={1}>
                        SMS Notifications
                      </Text>
                      <Text fontSize="sm" color="gray.500" numberOfLines={2}>
                        Receive notifications via SMS
                      </Text>
                    </VStack>
                    <Switch
                      value={settings.sms}
                      onValueChange={(value) => setSettings({...settings, sms: value})}
                      colorScheme="primary"
                    />
                  </HStack>
                </FormControl>
                
                <Divider />
                
                <FormControl>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800" numberOfLines={1}>
                        Marketing Emails
                      </Text>
                      <Text fontSize="sm" color="gray.500" numberOfLines={2}>
                        Receive promotional content
                      </Text>
                    </VStack>
                    <Switch
                      value={settings.marketing}
                      onValueChange={(value) => setSettings({...settings, marketing: value})}
                      colorScheme="primary"
                    />
                  </HStack>
                </FormControl>
              </VStack>
            </FormSection>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} pt={4}>
            <Button.Group space={3} w="full">
              <Button
                flex={1}
                variant="outline"
                colorScheme="gray"
                onPress={() => setShowSettings(false)}
                borderRadius="xl"
              >
                Cancel
              </Button>
              <Button
                flex={1}
                colorScheme="primary"
                onPress={handleSaveSettings}
                borderRadius="xl"
              >
                Save Changes
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default NotificationsScreen; 