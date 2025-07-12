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
  Input,
  FormControl,
  Select,
  Switch,
  useToast,
  Modal,
  Divider,
  AlertDialog,
  useDisclose,
  Center,
  Pressable,
  Heading,
  StatusBar,
  Circle,
} from 'native-base';
import { Alert, RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { userService, mockData, getAvatarInitials } from '../services/mockData';
import { 
  PageHeader,
  MetricCard,
  InfoCard,
  EmptyState,
  SkeletonLoader,
  UserAvatar,
  FormSection,
  ListItem,
  StatusBadge,
  FloatingActionButton
} from '../components/common/UIComponents';

const { width: screenWidth } = Dimensions.get('window');

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [settings, setSettings] = useState(mockData.settings);
  
  const { user, logout, updateUser } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclose();

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        visaType: user.visaType || '',
      });
    }
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userService.updateProfile(user.id, editForm);
      if (response.success) {
        await updateUser(response.data.user);
        setShowEditModal(false);
        toast.show({
          title: 'Profile updated successfully',
          description: 'Your changes have been saved',
          status: 'success',
          duration: 3000,
          placement: 'top',
        });
      }
    } catch (error) {
      toast.show({
        title: 'Update failed',
        description: error.message || 'Failed to update profile',
        status: 'error',
        duration: 3000,
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setIsLoading(true);
      const response = await userService.updateSettings(user.id, settings);
      if (response.success) {
        setShowSettingsModal(false);
        toast.show({
          title: 'Settings updated successfully',
          description: 'Your preferences have been saved',
          status: 'success',
          duration: 3000,
          placement: 'top',
        });
      }
    } catch (error) {
      toast.show({
        title: 'Update failed',
        description: error.message || 'Failed to update settings',
        status: 'error',
        duration: 3000,
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const ProfileHeader = ({ user }) => (
    <Box position="relative" borderRadius="3xl" overflow="hidden" mb={6}>
      <LinearGradient
        colors={['#3B82F6', '#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24 }}
      >
        {/* Enhanced floating design elements */}
        <Circle size="100" bg="white" opacity={0.08} position="absolute" top={-30} right={-30} />
        <Circle size="60" bg="white" opacity={0.06} position="absolute" bottom={-20} left={-20} />
        <Circle size="40" bg="white" opacity={0.04} position="absolute" top={30} left={30} />
        
        <VStack space={6}>
          <HStack alignItems="center" justifyContent="space-between">
            <VStack>
              <Text fontSize="sm" color="white" opacity={0.9}>
                Welcome to your
              </Text>
              <Heading fontSize="2xl" fontWeight="bold" color="white">
                Profile
              </Heading>
            </VStack>
            <IconButton
              icon={<Ionicons name="create" size={20} color="white" />}
              onPress={() => setShowEditModal(true)}
              bg="transparent"
              borderRadius="full"
              _pressed={{ bg: 'white', opacity: 0.2 }}
            />
          </HStack>
          
          <VStack alignItems="center" space={5}>
            <Box position="relative">
              <UserAvatar 
                user={user} 
                size="2xl" 
                variant="elevated"
              />
              <Box position="absolute" bottom={0} right={0}>
                <Circle size={8} bg="success.500" borderWidth={3} borderColor="white">
                  <Ionicons name="checkmark" size={16} color="white" />
                </Circle>
              </Box>
            </Box>
            
            <VStack alignItems="center" space={3}>
              <VStack alignItems="center" space={1}>
                <Heading fontSize="xl" fontWeight="bold" color="white">
                  {user?.name || 'Unknown User'}
                </Heading>
                <Text fontSize="md" color="white" opacity={0.9}>
                  {user?.email || 'No email'}
                </Text>
              </VStack>
              
              <HStack space={3}>
                <Badge 
                  colorScheme="warning" 
                  variant="solid" 
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {user?.tier || 'Gold'}
                </Badge>
                <Badge 
                  colorScheme="success" 
                  variant="solid" 
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {user?.accountType || 'Premium'}
                </Badge>
              </HStack>
              
              <HStack alignItems="center" space={4}>
                <HStack alignItems="center" space={2}>
                  <Circle size={3} bg="success.400" />
                  <Text fontSize="sm" color="white" opacity={0.9}>
                    Active since {new Date().getFullYear()}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </LinearGradient>
    </Box>
  );

  const AccountStats = ({ user }) => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800">
          Account Overview
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Your performance
        </Text>
      </HStack>
      
      <HStack space={3}>
        <MetricCard
          title="Referrals"
          value={user?.stats?.referrals || 0}
          subtitle="made"
          icon="people"
          color="primary"
          size="sm"
          trend={{ positive: true, value: '+2' }}
        />
        <MetricCard
          title="Progress"
          value={`${user?.progress?.percentage || 0}%`}
          subtitle="complete"
          icon="checkmark-circle"
          color="success"
          size="sm"
          trend={{ positive: true, value: '+15%' }}
        />
        <MetricCard
          title="Rewards"
          value={user?.stats?.rewards || 0}
          subtitle="earned"
          icon="gift"
          color="warning"
          size="sm"
          trend={{ positive: true, value: '+3' }}
        />
      </HStack>
    </VStack>
  );

  const PersonalInfo = ({ user }) => (
    <InfoCard
      title="Personal Information"
      icon="person-circle"
      color="primary"
      actions={[
        <IconButton
          key="edit"
          icon={<Ionicons name="create" size={16} color="primary.600" />}
          onPress={() => setShowEditModal(true)}
          size="sm"
          bg="primary.100"
          borderRadius="full"
          _pressed={{ bg: 'primary.200' }}
        />
      ]}
    >
      <VStack space={0}>
        <ListItem
          leftIcon="person"
          title="Full Name"
          subtitle={user?.name || 'Not provided'}
          isLast={false}
          variant="card"
        />
        <ListItem
          leftIcon="mail"
          title="Email Address"
          subtitle={user?.email || 'Not provided'}
          isLast={false}
          variant="card"
        />
        <ListItem
          leftIcon="call"
          title="Phone Number"
          subtitle={user?.phone || 'Not provided'}
          isLast={false}
          variant="card"
        />
        <ListItem
          leftIcon="globe"
          title="Country"
          subtitle={user?.country || 'Not provided'}
          isLast={true}
          variant="card"
        />
      </VStack>
    </InfoCard>
  );

  const ApplicationDetails = ({ user }) => (
    <InfoCard
      title="Application Details"
      icon="document-text"
      color="success"
    >
      <VStack space={0}>
        <ListItem
          leftIcon="card"
          title="Visa Type"
          subtitle={user?.visaType || 'Not specified'}
          isLast={false}
          variant="card"
        />
        <ListItem
          leftIcon="barcode"
          title="Application ID"
          subtitle={user?.applicationId || 'Not assigned'}
          isLast={false}
          variant="card"
        />
        <ListItem
          leftIcon="checkmark-circle"
          title="Status"
          subtitle={user?.status || 'Pending'}
          rightElement={
            <StatusBadge 
              status={user?.status || 'pending'} 
              variant="solid" 
              size="sm"
            />
          }
          isLast={false}
          variant="card"
        />
        <ListItem
          leftIcon="calendar"
          title="Submitted"
          subtitle={user?.submissionDate || 'Not submitted'}
          isLast={true}
          variant="card"
        />
      </VStack>
    </InfoCard>
  );

  const QuickActions = () => (
    <VStack space={4}>
      <Heading fontSize="lg" fontWeight="bold" color="gray.800">
        Quick Actions
      </Heading>
      
      <VStack space={3}>
        <ListItem
          leftIcon="create"
          title="Edit Profile"
          subtitle="Update your personal information"
          rightElement={
            <IconButton
              icon={<Ionicons name="chevron-forward" size={20} color="gray.400" />}
              onPress={() => setShowEditModal(true)}
              size="sm"
            />
          }
          onPress={() => setShowEditModal(true)}
          isLast={false}
        />
        
        <ListItem
          leftIcon="settings"
          title="Settings"
          subtitle="Manage your preferences"
          rightElement={
            <IconButton
              icon={<Ionicons name="chevron-forward" size={20} color="gray.400" />}
              onPress={() => setShowSettingsModal(true)}
              size="sm"
            />
          }
          onPress={() => setShowSettingsModal(true)}
          isLast={false}
        />
        
        <ListItem
          leftIcon="help-circle"
          title="Support"
          subtitle="Get help and support"
          rightElement={
            <IconButton
              icon={<Ionicons name="chevron-forward" size={20} color="gray.400" />}
              onPress={() => {
                toast.show({
                  title: 'Support Available',
                  description: 'Contact us at support@referralpro.com',
                  status: 'info',
                  duration: 3000,
                  placement: 'top',
                });
              }}
              size="sm"
            />
          }
          onPress={() => {
            toast.show({
              title: 'Support Available',
              description: 'Contact us at support@referralpro.com',
              status: 'info',
              duration: 3000,
              placement: 'top',
            });
          }}
          isLast={false}
        />
        
        <ListItem
          leftIcon="log-out"
          title="Sign Out"
          subtitle="Sign out of your account"
          rightElement={
            <IconButton
              icon={<Ionicons name="chevron-forward" size={20} color="error.400" />}
              onPress={handleLogout}
              size="sm"
            />
          }
          onPress={handleLogout}
          isLast={true}
        />
      </VStack>
    </VStack>
  );

  const LoadingSkeleton = () => (
    <Box flex={1} bg="background.secondary" safeArea>
      <VStack space={6} p={6}>
        <SkeletonLoader lines={1} height={12} />
        <SkeletonLoader lines={2} height={8} />
        <HStack space={3}>
          <SkeletonLoader lines={1} height={20} />
          <SkeletonLoader lines={1} height={20} />
          <SkeletonLoader lines={1} height={20} />
        </HStack>
        <SkeletonLoader lines={1} height={16} />
        <SkeletonLoader lines={4} height={16} />
        <SkeletonLoader lines={4} height={16} />
      </VStack>
    </Box>
  );

  if (isLoading && !user) {
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
          {/* Profile Header */}
          <ProfileHeader user={user} />

          {/* Account Stats */}
          <AccountStats user={user} />

          {/* Personal Information */}
          <PersonalInfo user={user} />

          {/* Application Details */}
          <ApplicationDetails user={user} />

          {/* Quick Actions */}
          <QuickActions />
        </VStack>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} size="lg">
        <Modal.Content maxWidth="400px" borderRadius="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0} pb={2}>
            <HStack alignItems="center" space={2}>
              <Box bg="primary.100" p={2} borderRadius="lg">
                <Ionicons name="create" size={20} color="#3B82F6" />
              </Box>
              <Heading fontSize="lg" fontWeight="bold" color="gray.800">
                Edit Profile
              </Heading>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <FormSection title="Personal Information" icon="person">
              <VStack space={4}>
                <FormControl>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Full Name
                    </Text>
                  </FormControl.Label>
                  <Input
                    value={editForm.name}
                    onChangeText={(value) => setEditForm({...editForm, name: value})}
                    placeholder="Enter your full name"
                    bg="gray.50"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _focus={{ borderColor: "primary.500", bg: "white" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Email Address
                    </Text>
                  </FormControl.Label>
                  <Input
                    value={editForm.email}
                    onChangeText={(value) => setEditForm({...editForm, email: value})}
                    placeholder="Enter your email"
                    bg="gray.50"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _focus={{ borderColor: "primary.500", bg: "white" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Phone Number
                    </Text>
                  </FormControl.Label>
                  <Input
                    value={editForm.phone}
                    onChangeText={(value) => setEditForm({...editForm, phone: value})}
                    placeholder="Enter your phone number"
                    bg="gray.50"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _focus={{ borderColor: "primary.500", bg: "white" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Country
                    </Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={editForm.country}
                    onValueChange={(value) => setEditForm({...editForm, country: value})}
                    bg="gray.50"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _selectedItem={{
                      bg: "primary.100",
                      endIcon: <Ionicons name="checkmark" size={16} color="primary.600" />,
                    }}
                  >
                    <Select.Item label="United States" value="US" />
                    <Select.Item label="Canada" value="CA" />
                    <Select.Item label="United Kingdom" value="UK" />
                    <Select.Item label="Australia" value="AU" />
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Visa Type
                    </Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={editForm.visaType}
                    onValueChange={(value) => setEditForm({...editForm, visaType: value})}
                    bg="gray.50"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _selectedItem={{
                      bg: "primary.100",
                      endIcon: <Ionicons name="checkmark" size={16} color="primary.600" />,
                    }}
                  >
                    <Select.Item label="Tourist Visa" value="tourist" />
                    <Select.Item label="Business Visa" value="business" />
                    <Select.Item label="Student Visa" value="student" />
                    <Select.Item label="Work Visa" value="work" />
                  </Select>
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
                onPress={() => setShowEditModal(false)}
                borderRadius="xl"
              >
                Cancel
              </Button>
              <Button
                flex={1}
                colorScheme="primary"
                onPress={handleUpdateProfile}
                isLoading={isLoading}
                borderRadius="xl"
              >
                Save Changes
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} size="lg">
        <Modal.Content maxWidth="400px" borderRadius="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0} pb={2}>
            <HStack alignItems="center" space={2}>
              <Box bg="primary.100" p={2} borderRadius="lg">
                <Ionicons name="settings" size={20} color="#3B82F6" />
              </Box>
              <Heading fontSize="lg" fontWeight="bold" color="gray.800">
                Settings
              </Heading>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <FormSection title="Preferences" icon="settings">
              <VStack space={4}>
                <FormControl>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800">
                        Push Notifications
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Receive notifications on your device
                      </Text>
                    </VStack>
                    <Switch
                      value={settings.notifications}
                      onValueChange={(value) => setSettings({...settings, notifications: value})}
                      colorScheme="primary"
                    />
                  </HStack>
                </FormControl>
                
                <Divider />
                
                <FormControl>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800">
                        Email Updates
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Receive email notifications
                      </Text>
                    </VStack>
                    <Switch
                      value={settings.emailNotifications}
                      onValueChange={(value) => setSettings({...settings, emailNotifications: value})}
                      colorScheme="primary"
                    />
                  </HStack>
                </FormControl>
                
                <Divider />
                
                <FormControl>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800">
                        Dark Mode
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Use dark theme
                      </Text>
                    </VStack>
                    <Switch
                      value={settings.darkMode}
                      onValueChange={(value) => setSettings({...settings, darkMode: value})}
                      colorScheme="primary"
                    />
                  </HStack>
                </FormControl>
                
                <Divider />
                
                <FormControl>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800">
                        Auto-save
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Automatically save changes
                      </Text>
                    </VStack>
                    <Switch
                      value={settings.autoSave}
                      onValueChange={(value) => setSettings({...settings, autoSave: value})}
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
                onPress={() => setShowSettingsModal(false)}
                borderRadius="xl"
              >
                Cancel
              </Button>
              <Button
                flex={1}
                colorScheme="primary"
                onPress={handleUpdateSettings}
                isLoading={isLoading}
                borderRadius="xl"
              >
                Save Settings
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon="refresh"
        onPress={handleRefresh}
        colorScheme="primary"
        label="Refresh"
      />
    </Box>
  );
};

export default ProfileScreen; 