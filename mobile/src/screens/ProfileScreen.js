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
  Skeleton,
  Modal,
  Divider,
  AlertDialog,
  useDisclose,
} from 'native-base';
import { Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { userService, mockData } from '../services/mockData';

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
          title: 'Success',
          description: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        status: 'error',
        duration: 3000,
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
          title: 'Success',
          description: 'Settings updated successfully',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        description: error.message || 'Failed to update settings',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
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
        {subtitle && (
          <Text fontSize="xs" color="gray.500" textAlign="center">
            {subtitle}
          </Text>
        )}
      </VStack>
    </Card>
  );

  const InfoCard = ({ title, children }) => (
    <Card bg="white" borderRadius="xl" p={4}>
      <VStack space={3}>
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          {title}
        </Text>
        {children}
      </VStack>
    </Card>
  );

  const InfoRow = ({ label, value, icon }) => (
    <HStack alignItems="center" space={3}>
      <Box bg="primary.100" p={2} borderRadius="full">
        <Ionicons name={icon} size={16} color="#3B82F6" />
      </Box>
      <VStack flex={1}>
        <Text fontSize="xs" color="gray.500">
          {label}
        </Text>
        <Text fontSize="sm" color="gray.700" fontWeight="medium">
          {value || 'Not provided'}
        </Text>
      </VStack>
    </HStack>
  );

  if (isLoading && !user) {
    return (
      <Box flex={1} bg="gray.50" safeArea>
        <ScrollView>
          <VStack space={4} p={4}>
            <Skeleton h="32" borderRadius="xl" />
            <HStack space={3}>
              <Skeleton h="32" flex={1} borderRadius="xl" />
              <Skeleton h="32" flex={1} borderRadius="xl" />
              <Skeleton h="32" flex={1} borderRadius="xl" />
            </HStack>
            <Skeleton h="40" borderRadius="xl" />
            <Skeleton h="40" borderRadius="xl" />
            <Skeleton h="40" borderRadius="xl" />
          </VStack>
        </ScrollView>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" safeArea>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <VStack space={4} p={4}>
          {/* Profile Header */}
          <Card bg="primary.500" borderRadius="xl" p={6}>
            <VStack alignItems="center" space={4}>
              <Avatar
                source={{ uri: user?.avatar }}
                size="xl"
                bg="white"
              >
                {user?.name?.charAt(0)}
              </Avatar>
              <VStack alignItems="center" space={2}>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                  {user?.name}
                </Text>
                <Text fontSize="md" color="primary.100">
                  {user?.email}
                </Text>
                <HStack alignItems="center" space={2}>
                  <Badge colorScheme="white" variant="solid" borderRadius="full">
                    {user?.tier || 'Gold'}
                  </Badge>
                  <Badge colorScheme="green" variant="solid" borderRadius="full">
                    {user?.accountType || 'Premium'}
                  </Badge>
                </HStack>
              </VStack>
              <HStack space={2} mt={2}>
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="white"
                  onPress={() => setShowEditModal(true)}
                  leftIcon={<Ionicons name="create" size={16} />}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="white"
                  onPress={() => setShowSettingsModal(true)}
                  leftIcon={<Ionicons name="settings" size={16} />}
                >
                  Settings
                </Button>
              </HStack>
            </VStack>
          </Card>

          {/* Account Stats */}
          <HStack space={2}>
            <StatCard
              title="Total Referrals"
              value={user?.totalReferrals || 0}
              subtitle="lifetime"
              icon="people"
              color="blue"
            />
            <StatCard
              title="Successful"
              value={user?.successfulReferrals || 0}
              subtitle="referrals"
              icon="checkmark-circle"
              color="green"
            />
            <StatCard
              title="Reward Points"
              value={user?.points || 0}
              subtitle="earned"
              icon="trophy"
              color="orange"
            />
          </HStack>

          {/* Personal Information */}
          <InfoCard title="Personal Information">
            <VStack space={3}>
              <InfoRow
                label="Full Name"
                value={user?.name}
                icon="person"
              />
              <InfoRow
                label="Email Address"
                value={user?.email}
                icon="mail"
              />
              <InfoRow
                label="Phone Number"
                value={user?.phone}
                icon="call"
              />
              <InfoRow
                label="Country"
                value={user?.country}
                icon="location"
              />
              <InfoRow
                label="Visa Type"
                value={user?.visaType}
                icon="document-text"
              />
            </VStack>
          </InfoCard>

          {/* Application Status */}
          <InfoCard title="Application Status">
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.600">
                  Current Stage
                </Text>
                <Badge colorScheme="blue" variant="solid" borderRadius="full">
                  {user?.currentStage || 'Initial Enquiry'}
                </Badge>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.600">
                  Progress
                </Text>
                <Text fontSize="sm" color="primary.600" fontWeight="bold">
                  {(user?.progress?.current || 1) * 20}% Complete
                </Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.600">
                  Member Since
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {user?.joinDate || 'N/A'}
                </Text>
              </HStack>
            </VStack>
          </InfoCard>

          {/* Referral Information */}
          <InfoCard title="Referral Information">
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.600">
                  Referral Code
                </Text>
                <HStack alignItems="center" space={2}>
                  <Text fontSize="sm" color="gray.700" fontWeight="bold">
                    {user?.referralCode}
                  </Text>
                  <IconButton
                    icon={<Ionicons name="copy" size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="primary"
                    onPress={() => {
                      // Copy to clipboard functionality would go here
                      toast.show({
                        title: 'Copied!',
                        description: 'Referral code copied to clipboard',
                        status: 'success',
                        duration: 2000,
                      });
                    }}
                  />
                </HStack>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.600">
                  Success Rate
                </Text>
                <Text fontSize="sm" color="green.600" fontWeight="bold">
                  {user?.totalReferrals ? Math.round((user.successfulReferrals / user.totalReferrals) * 100) : 0}%
                </Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="sm" color="gray.600">
                  Commission Earned
                </Text>
                <Text fontSize="sm" color="green.600" fontWeight="bold">
                  $2,450
                </Text>
              </HStack>
            </VStack>
          </InfoCard>

          {/* Quick Actions */}
          <Card bg="white" borderRadius="xl" p={4}>
            <VStack space={3}>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Quick Actions
              </Text>
              <VStack space={2}>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  justifyContent="flex-start"
                  leftIcon={<Ionicons name="person-add" size={20} />}
                  onPress={() => {
                    // Navigate to referrals
                    toast.show({
                      title: 'Navigate',
                      description: 'Opening referrals page...',
                      status: 'info',
                      duration: 2000,
                    });
                  }}
                >
                  Create New Referral
                </Button>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  justifyContent="flex-start"
                  leftIcon={<Ionicons name="bar-chart" size={20} />}
                  onPress={() => {
                    // Navigate to progress
                    toast.show({
                      title: 'Navigate',
                      description: 'Opening progress page...',
                      status: 'info',
                      duration: 2000,
                    });
                  }}
                >
                  View Progress
                </Button>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  justifyContent="flex-start"
                  leftIcon={<Ionicons name="document-text" size={20} />}
                  onPress={() => {
                    // Navigate to documents
                    toast.show({
                      title: 'Navigate',
                      description: 'Opening documents page...',
                      status: 'info',
                      duration: 2000,
                    });
                  }}
                >
                  Upload Documents
                </Button>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  justifyContent="flex-start"
                  leftIcon={<Ionicons name="help-circle" size={20} />}
                  onPress={() => {
                    Alert.alert(
                      'Support',
                      'Contact our support team:\n\nPhone: +1-800-VISA-HELP\nEmail: support@visaconsultancy.com'
                    );
                  }}
                >
                  Contact Support
                </Button>
              </VStack>
            </VStack>
          </Card>

          {/* Logout */}
          <Card bg="red.50" borderRadius="xl" p={4}>
            <VStack alignItems="center" space={3}>
              <Box bg="red.500" p={3} borderRadius="full">
                <Ionicons name="log-out" size={24} color="white" />
              </Box>
              <Text fontSize="md" fontWeight="medium" color="red.600">
                Sign Out
              </Text>
              <Text fontSize="sm" color="red.500" textAlign="center">
                You will be logged out of your account
              </Text>
              <Button
                colorScheme="red"
                variant="outline"
                onPress={handleLogout}
                leftIcon={<Ionicons name="log-out" size={16} />}
              >
                Logout
              </Button>
            </VStack>
          </Card>
        </VStack>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} size="full">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit Profile</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <FormControl>
                <FormControl.Label>Full Name</FormControl.Label>
                <Input
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({...editForm, name: text})}
                  placeholder="Enter your full name"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Email Address</FormControl.Label>
                <Input
                  value={editForm.email}
                  onChangeText={(text) => setEditForm({...editForm, email: text})}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  isReadOnly
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Phone Number</FormControl.Label>
                <Input
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm({...editForm, phone: text})}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Country</FormControl.Label>
                <Select
                  selectedValue={editForm.country}
                  onValueChange={(value) => setEditForm({...editForm, country: value})}
                  placeholder="Select your country"
                >
                  {mockData.countries.map((country) => (
                    <Select.Item key={country.id} label={country.name} value={country.name} />
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormControl.Label>Visa Type</FormControl.Label>
                <Select
                  selectedValue={editForm.visaType}
                  onValueChange={(value) => setEditForm({...editForm, visaType: value})}
                  placeholder="Select visa type"
                >
                  {mockData.visaTypes.map((type) => (
                    <Select.Item key={type.id} label={type.name} value={type.name} />
                  ))}
                </Select>
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                onPress={handleUpdateProfile}
                isLoading={isLoading}
                isLoadingText="Saving..."
              >
                Save Changes
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} size="full">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Settings</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <VStack space={3}>
                <Text fontSize="md" fontWeight="bold" color="gray.700">
                  Notifications
                </Text>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Email Notifications
                  </Text>
                  <Switch
                    isChecked={settings.notifications.emailNotifications}
                    onToggle={(value) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        emailNotifications: value
                      }
                    })}
                  />
                </HStack>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Push Notifications
                  </Text>
                  <Switch
                    isChecked={settings.notifications.pushNotifications}
                    onToggle={(value) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        pushNotifications: value
                      }
                    })}
                  />
                </HStack>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" color="gray.600">
                    SMS Notifications
                  </Text>
                  <Switch
                    isChecked={settings.notifications.smsNotifications}
                    onToggle={(value) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        smsNotifications: value
                      }
                    })}
                  />
                </HStack>
              </VStack>

              <Divider />

              <VStack space={3}>
                <Text fontSize="md" fontWeight="bold" color="gray.700">
                  Privacy
                </Text>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Profile Visible
                  </Text>
                  <Switch
                    isChecked={settings.privacy.profileVisible}
                    onToggle={(value) => setSettings({
                      ...settings,
                      privacy: {
                        ...settings.privacy,
                        profileVisible: value
                      }
                    })}
                  />
                </HStack>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Share Progress
                  </Text>
                  <Switch
                    isChecked={settings.privacy.shareProgress}
                    onToggle={(value) => setSettings({
                      ...settings,
                      privacy: {
                        ...settings.privacy,
                        shareProgress: value
                      }
                    })}
                  />
                </HStack>
              </VStack>

              <Divider />

              <VStack space={3}>
                <Text fontSize="md" fontWeight="bold" color="gray.700">
                  Preferences
                </Text>
                <FormControl>
                  <FormControl.Label>Theme</FormControl.Label>
                  <Select
                    selectedValue={settings.preferences.theme}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        theme: value
                      }
                    })}
                  >
                    <Select.Item label="Light" value="light" />
                    <Select.Item label="Dark" value="dark" />
                    <Select.Item label="System" value="system" />
                  </Select>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Language</FormControl.Label>
                  <Select
                    selectedValue={settings.preferences.language}
                    onValueChange={(value) => setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        language: value
                      }
                    })}
                  >
                    <Select.Item label="English" value="en" />
                    <Select.Item label="Spanish" value="es" />
                    <Select.Item label="French" value="fr" />
                    <Select.Item label="German" value="de" />
                  </Select>
                </FormControl>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => setShowSettingsModal(false)}
              >
                Cancel
              </Button>
              <Button
                onPress={handleUpdateSettings}
                isLoading={isLoading}
                isLoadingText="Saving..."
              >
                Save Settings
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default ProfileScreen; 