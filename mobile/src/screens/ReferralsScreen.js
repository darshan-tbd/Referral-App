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
  Input,
  TextArea,
  Select,
  FormControl,
  Modal,
  useToast,
  AlertDialog,
  useDisclose,
  IconButton,
  Center,
  Pressable,
  Divider,
  Heading,
  StatusBar,
  Circle,
} from 'native-base';
import { RefreshControl, Dimensions, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { referralService, mockData } from '../services/mockData';
import { 
  PageHeader,
  MetricCard,
  ActionCard,
  InfoCard,
  EmptyState,
  SkeletonLoader,
  StatusBadge,
  FloatingActionButton,
  FormSection,
  ListItem,
  NotificationCard
} from '../components/common/UIComponents';

const { width: screenWidth } = Dimensions.get('window');

const ReferralsScreen = () => {
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [newReferral, setNewReferral] = useState({
    refereeName: '',
    refereeEmail: '',
    refereePhone: '',
    visaType: '',
    country: '',
    notes: '',
  });
  
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclose();

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setIsLoading(true);
      const response = await referralService.getReferrals(user?.id);
      if (response.success) {
        setReferrals(response.data.referrals);
      }
    } catch (error) {
      console.error('Error loading referrals:', error);
      toast.show({
        title: 'Error loading referrals',
        description: 'Failed to load referrals. Please try again.',
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
    await loadReferrals();
    setIsRefreshing(false);
  };

  const handleSubmitReferral = async () => {
    if (!newReferral.refereeName || !newReferral.refereeEmail || !newReferral.visaType || !newReferral.country) {
      toast.show({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
        placement: 'top',
      });
      return;
    }

    try {
      const referralData = {
        ...newReferral,
        referrerName: user?.name,
        referrerEmail: user?.email,
      };

      const response = await referralService.createReferral(referralData);
      if (response.success) {
        setReferrals([response.data.referral, ...referrals]);
        setNewReferral({
          refereeName: '',
          refereeEmail: '',
          refereePhone: '',
          visaType: '',
          country: '',
          notes: '',
        });
        setShowNewReferralModal(false);
        toast.show({
          title: 'Referral submitted successfully!',
          description: 'Your referral has been created and is now being processed.',
          status: 'success',
          duration: 3000,
          placement: 'top',
        });
      }
    } catch (error) {
      toast.show({
        title: 'Submission failed',
        description: error.message || 'Failed to submit referral',
        status: 'error',
        duration: 3000,
        placement: 'top',
      });
    }
  };

  const handleShare = async (referral) => {
    try {
      const shareText = `Check out this great referral service! I referred ${referral.refereeName} and they're getting excellent support. Use my referral code: ${user?.referralCode}`;
      await Share.share({
        message: shareText,
        title: 'ReferralPro Referral',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesStatus = filterStatus === 'all' || referral.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      referral.refereeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.refereeEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });



  // Improved Overview Cards with better responsive layout
  const ReferralsOverview = () => (
    <Card bg="white" borderRadius="2xl" p={4} shadow="sm" variant="elevated">
      <VStack space={3}>
        <HStack alignItems="center" justifyContent="space-between">
          <VStack>
            <Heading fontSize="md" fontWeight="bold" color="gray.800" numberOfLines={1}>
              Performance Overview
            </Heading>
            <Text fontSize="xs" color="gray.500" numberOfLines={1}>
              Your referral statistics
            </Text>
          </VStack>
          <Box bg="primary.100" p={2} borderRadius="lg">
            <Ionicons name="analytics" size={18} color="#3B82F6" />
          </Box>
        </HStack>
        
        {/* Compact metric cards in single row */}
        <HStack space={2} justifyContent="space-between">
          <Box flex={1}>
            <MetricCard
              title="Total"
              value={referrals.length}
              subtitle="referrals"
              icon="people-outline"
              color="primary"
              size="xs"
            />
          </Box>
          <Box flex={1}>
            <MetricCard
              title="Approved"
              value={referrals.filter(r => r.status === 'approved').length}
              subtitle="successful"
              icon="checkmark-circle-outline"
              color="success"
              size="xs"
            />
          </Box>
          <Box flex={1}>
            <MetricCard
              title="Earnings"
              value={`$${referrals.reduce((sum, r) => sum + (r.status === 'approved' ? r.commissionAmount : 0), 0)}`}
              subtitle="commission"
              icon="trophy-outline"
              color="warning"
              size="xs"
            />
          </Box>
        </HStack>
      </VStack>
    </Card>
  );

  // Improved Quick Actions with better layout
  const QuickActions = () => (
    <Card bg="white" borderRadius="2xl" p={4} shadow="sm" variant="elevated">
      <VStack space={3}>
        <HStack alignItems="center" justifyContent="space-between">
          <VStack>
            <Heading fontSize="md" fontWeight="bold" color="gray.800" numberOfLines={1}>
              Quick Actions
            </Heading>
            <Text fontSize="xs" color="gray.500" numberOfLines={1}>
              Common tasks
            </Text>
          </VStack>
          <Box bg="success.100" p={2} borderRadius="lg">
            <Ionicons name="flash" size={18} color="#22C55E" />
          </Box>
        </HStack>
        
        {/* Compact action cards in single row */}
        <HStack space={2} justifyContent="space-between">
          <Box flex={1}>
            <ActionCard
              title="New Referral"
              description="Refer someone"
              icon="person-add-outline"
              color="primary"
              onPress={() => setShowNewReferralModal(true)}
              size="sm"
            />
          </Box>
          <Box flex={1}>
            <ActionCard
              title="Share Code"
              description="Share link"
              icon="share-outline"
              color="success"
              onPress={() => setShowShareModal(true)}
              size="sm"
            />
          </Box>
          <Box flex={1}>
            <ActionCard
              title="Analytics"
              description="View stats"
              icon="bar-chart-outline"
              color="warning"
              onPress={() => {
                toast.show({
                  title: 'Analytics Coming Soon',
                  description: 'Detailed analytics will be available soon!',
                  status: 'info',
                  duration: 2000,
                  placement: 'top',
                });
              }}
              size="sm"
            />
          </Box>
        </HStack>
      </VStack>
    </Card>
  );

  // Enhanced Search and Filter Section
  const SearchAndFilter = () => (
    <Card bg="white" borderRadius="2xl" p={4} shadow="sm" variant="elevated">
      <VStack space={3}>
        <HStack alignItems="center" space={3}>
          <Box bg="blue.100" p={2} borderRadius="lg">
            <Ionicons name="search" size={16} color="#3B82F6" />
          </Box>
          <Heading fontSize="sm" fontWeight="semibold" color="gray.800" numberOfLines={1}>
            Search & Filter
          </Heading>
        </HStack>
        
        <VStack space={3}>
          {/* Search Input */}
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or email..."
            bg="gray.50"
            borderWidth={1}
            borderColor="gray.200"
            borderRadius="xl"
            fontSize="sm"
            InputLeftElement={
              <Box ml={3}>
                <Ionicons name="search" size={16} color="gray.400" />
              </Box>
            }
            InputRightElement={
              searchQuery ? (
                <Pressable onPress={() => setSearchQuery('')} mr={3}>
                  <Ionicons name="close-circle" size={16} color="gray.400" />
                </Pressable>
              ) : null
            }
            _focus={{ borderColor: "primary.500", bg: "white" }}
          />
          
          {/* Filter Dropdown */}
          <HStack space={3} alignItems="center">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" minW="16">
              Status:
            </Text>
            <Box flex={1}>
              <Select
                selectedValue={filterStatus}
                onValueChange={setFilterStatus}
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
                <Select.Item label="All Referrals" value="all" />
                <Select.Item label="Pending" value="pending" />
                <Select.Item label="Approved" value="approved" />
                <Select.Item label="Rejected" value="rejected" />
                <Select.Item label="In Progress" value="in_progress" />
              </Select>
            </Box>
          </HStack>
          
          {/* Results Count */}
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="xs" color="gray.500">
              {filteredReferrals.length} of {referrals.length} referrals
            </Text>
            {(filterStatus !== 'all' || searchQuery) && (
              <Pressable 
                onPress={() => {
                  setFilterStatus('all');
                  setSearchQuery('');
                }}
              >
                <Text fontSize="xs" color="primary.600" fontWeight="medium">
                  Clear filters
                </Text>
              </Pressable>
            )}
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );

  // Enhanced Referrals List with better card design
  const ReferralsList = () => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800" numberOfLines={1}>
          Recent Referrals
        </Heading>
        <Text fontSize="sm" color="gray.500" numberOfLines={1}>
          {filteredReferrals.length} items
        </Text>
      </HStack>
      
      {filteredReferrals.length > 0 ? (
        <VStack space={3}>
          {filteredReferrals.map((referral, index) => (
            <Card 
              key={referral.id} 
              bg="white" 
              borderRadius="2xl" 
              p={4} 
              shadow="sm" 
              variant="elevated"
            >
              <VStack space={3}>
                {/* Header with avatar and status */}
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space={3} flex={1}>
                    <Circle size={10} bg="primary.500">
                      <Text fontSize="sm" fontWeight="bold" color="white" numberOfLines={1}>
                        {referral.refereeName?.[0]?.toUpperCase() || 'R'}
                      </Text>
                    </Circle>
                    <VStack flex={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.800" numberOfLines={1}>
                        {referral.refereeName}
                      </Text>
                      <Text fontSize="xs" color="gray.500" numberOfLines={1}>
                        {referral.refereeEmail}
                      </Text>
                    </VStack>
                  </HStack>
                  <StatusBadge status={referral.status} size="sm" />
                </HStack>
                
                {/* Details */}
                <VStack space={2}>
                  <HStack justifyContent="space-between">
                    <VStack>
                      <Text fontSize="xs" color="gray.500">Visa Type</Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700" numberOfLines={1}>
                        {referral.visaType}
                      </Text>
                    </VStack>
                    <VStack alignItems="flex-end">
                      <Text fontSize="xs" color="gray.500">Commission</Text>
                      <Text fontSize="sm" fontWeight="bold" color="success.600">
                        ${referral.commissionAmount}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack justifyContent="space-between">
                    <VStack>
                      <Text fontSize="xs" color="gray.500">Country</Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700" numberOfLines={1}>
                        {referral.country}
                      </Text>
                    </VStack>
                    <VStack alignItems="flex-end">
                      <Text fontSize="xs" color="gray.500">Submitted</Text>
                      <Text fontSize="sm" color="gray.600" numberOfLines={1}>
                        {new Date(referral.submittedAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
                
                {/* Actions */}
                <Divider />
                <HStack justifyContent="space-between" alignItems="center">
                  <HStack space={4}>
                    <Pressable 
                      onPress={() => setSelectedReferral(referral)}
                      _pressed={{ opacity: 0.7 }}
                    >
                      <HStack alignItems="center" space={1}>
                        <Ionicons name="eye-outline" size={16} color="#3B82F6" />
                        <Text fontSize="sm" color="primary.600" fontWeight="medium">
                          View
                        </Text>
                      </HStack>
                    </Pressable>
                    <Pressable 
                      onPress={() => handleShare(referral)}
                      _pressed={{ opacity: 0.7 }}
                    >
                      <HStack alignItems="center" space={1}>
                        <Ionicons name="share-outline" size={16} color="#22C55E" />
                        <Text fontSize="sm" color="success.600" fontWeight="medium">
                          Share
                        </Text>
                      </HStack>
                    </Pressable>
                  </HStack>
                  <Text fontSize="xs" color="gray.400">
                    ID: {referral.id}
                  </Text>
                </HStack>
              </VStack>
            </Card>
          ))}
        </VStack>
      ) : (
        <EmptyState
          icon="people-outline"
          title="No referrals found"
          description={
            filterStatus === 'all' && !searchQuery
              ? "You haven't made any referrals yet. Start referring friends to earn rewards!"
              : "No referrals match your current search and filter criteria."
          }
          size="lg"
          action={
            filterStatus === 'all' && !searchQuery ? (
              <Button
                onPress={() => setShowNewReferralModal(true)}
                colorScheme="primary"
                borderRadius="xl"
                leftIcon={<Ionicons name="person-add" size={16} color="white" />}
              >
                Create First Referral
              </Button>
            ) : (
              <Button
                onPress={() => {
                  setFilterStatus('all');
                  setSearchQuery('');
                }}
                colorScheme="primary"
                variant="outline"
                borderRadius="xl"
              >
                Clear Filters
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
        <SkeletonLoader lines={3} height={20} />
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
              title="My Referrals"
              subtitle="Refer friends and earn rewards"
              variant="gradient"
              actions={[
                <IconButton
                  key="share"
                  icon={<Ionicons name="share-outline" size={20} color="white" />}
                  onPress={() => setShowShareModal(true)}
                  bg="white"
                  bgOpacity={0.2}
                  borderRadius="full"
                  _pressed={{ bg: 'white', bgOpacity: 0.3 }}
                />,
                <IconButton
                  key="add"
                  icon={<Ionicons name="add" size={22} color="white" />}
                  onPress={() => setShowNewReferralModal(true)}
                  bg="white"
                  bgOpacity={0.2}
                  borderRadius="full"
                  _pressed={{ bg: 'white', bgOpacity: 0.3 }}
                />
              ]}
            />
          </Box>

          {/* Referrals Overview */}
          <ReferralsOverview />

          {/* Quick Actions */}
          <QuickActions />

          {/* Search and Filter */}
          <SearchAndFilter />

          {/* Referrals List */}
          <ReferralsList />
        </VStack>
      </ScrollView>

      {/* New Referral Modal */}
      <Modal isOpen={showNewReferralModal} onClose={() => setShowNewReferralModal(false)} size="lg">
        <Modal.Content maxWidth="400px" borderRadius="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0} pb={2}>
            <HStack alignItems="center" space={2}>
              <Box bg="primary.100" p={2} borderRadius="lg">
                <Ionicons name="person-add" size={20} color="#3B82F6" />
              </Box>
              <Heading fontSize="lg" fontWeight="bold" color="gray.800">
                New Referral
              </Heading>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <FormSection title="Referee Information" icon="person">
              <VStack space={4}>
                <FormControl isRequired>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Full Name
                    </Text>
                  </FormControl.Label>
                  <Input
                    value={newReferral.refereeName}
                    onChangeText={(value) => setNewReferral({...newReferral, refereeName: value})}
                    placeholder="Enter referee's full name"
                    bg="gray.50"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _focus={{ borderColor: "primary.500", bg: "white" }}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Email Address
                    </Text>
                  </FormControl.Label>
                  <Input
                    value={newReferral.refereeEmail}
                    onChangeText={(value) => setNewReferral({...newReferral, refereeEmail: value})}
                    placeholder="Enter email address"
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
                    value={newReferral.refereePhone}
                    onChangeText={(value) => setNewReferral({...newReferral, refereePhone: value})}
                    placeholder="Enter phone number (optional)"
                    bg="gray.50"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderRadius="xl"
                    _focus={{ borderColor: "primary.500", bg: "white" }}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Visa Type
                    </Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={newReferral.visaType}
                    onValueChange={(value) => setNewReferral({...newReferral, visaType: value})}
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
                
                <FormControl isRequired>
                  <FormControl.Label>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                      Destination Country
                    </Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={newReferral.country}
                    onValueChange={(value) => setNewReferral({...newReferral, country: value})}
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
                      Additional Notes
                    </Text>
                  </FormControl.Label>
                  <TextArea
                    value={newReferral.notes}
                    onChangeText={(value) => setNewReferral({...newReferral, notes: value})}
                    placeholder="Any additional notes or special requirements..."
                    bg="gray.50"
                    borderWidth={1}
                    borderColor="gray.200"
                    borderRadius="xl"
                    h={20}
                    _focus={{ borderColor: "primary.500", bg: "white" }}
                  />
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
                onPress={() => setShowNewReferralModal(false)}
                borderRadius="xl"
              >
                Cancel
              </Button>
              <Button
                flex={1}
                colorScheme="primary"
                onPress={handleSubmitReferral}
                borderRadius="xl"
              >
                Submit Referral
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} size="lg">
        <Modal.Content maxWidth="400px" borderRadius="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0} pb={2}>
            <HStack alignItems="center" space={2}>
              <Box bg="success.100" p={2} borderRadius="lg">
                <Ionicons name="gift" size={20} color="#22C55E" />
              </Box>
              <Heading fontSize="lg" fontWeight="bold" color="gray.800">
                Share Referral Code
              </Heading>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <VStack space={6} alignItems="center">
              <VStack alignItems="center" space={2}>
                <Text fontSize="lg" fontWeight="bold" color="gray.700" textAlign="center">
                  Your Referral Code
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Share this code with friends and family
                </Text>
              </VStack>
              
              <Card bg="primary.50" borderRadius="2xl" p={6} w="full" borderWidth={1} borderColor="primary.200">
                <VStack alignItems="center" space={3}>
                  <Text fontSize="3xl" fontWeight="extrabold" color="primary.600" letterSpacing="wider">
                    {user?.referralCode || 'REF123456'}
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="primary"
                    borderRadius="lg"
                    leftIcon={<Ionicons name="copy" size={14} color="#3B82F6" />}
                    onPress={() => {
                      toast.show({
                        title: 'Code copied!',
                        description: 'Referral code copied to clipboard',
                        status: 'success',
                        duration: 2000,
                        placement: 'top',
                      });
                    }}
                  >
                    Copy Code
                  </Button>
                </VStack>
              </Card>
              
              <VStack alignItems="center" space={2}>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  When someone uses your code, you'll earn rewards when their application is approved!
                </Text>
                <HStack alignItems="center" space={2}>
                  <Ionicons name="gift" size={16} color="#F59E0B" />
                  <Text fontSize="xs" color="warning.600" fontWeight="semibold">
                    Earn up to $250 per successful referral
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} pt={4}>
            <Button.Group space={3} w="full">
              <Button
                flex={1}
                variant="outline"
                colorScheme="gray"
                onPress={() => setShowShareModal(false)}
                borderRadius="xl"
              >
                Close
              </Button>
              <Button
                flex={1}
                colorScheme="primary"
                borderRadius="xl"
                leftIcon={<Ionicons name="share" size={16} color="white" />}
                onPress={async () => {
                  await Share.share({
                    message: `Use my referral code ${user?.referralCode || 'REF123456'} for professional referral services and get exclusive benefits!`,
                    title: 'ReferralPro - Referral Code',
                  });
                }}
              >
                Share Code
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Referral Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <Modal.Content maxWidth="400px" borderRadius="2xl">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={0} pb={2}>
            <HStack alignItems="center" space={2}>
              <Box bg="primary.100" p={2} borderRadius="lg">
                <Ionicons name="document-text" size={20} color="#3B82F6" />
              </Box>
              <Heading fontSize="lg" fontWeight="bold" color="gray.800">
                Referral Details
              </Heading>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            {selectedReferral && (
              <VStack space={5}>
                <HStack alignItems="center" space={4}>
                  <Circle size={14} bg="primary.100">
                    <Ionicons name="person" size={24} color="#3B82F6" />
                  </Circle>
                  <VStack flex={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      {selectedReferral.refereeName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {selectedReferral.refereeEmail}
                    </Text>
                  </VStack>
                  <StatusBadge 
                    status={selectedReferral.status} 
                    variant="solid" 
                    size="lg"
                  />
                </HStack>
                
                <Divider />
                
                <FormSection title="Application Details" icon="document">
                  <VStack space={0}>
                    <ListItem
                      leftIcon="card"
                      title="Visa Type"
                      subtitle={selectedReferral.visaType}
                      isLast={false}
                      variant="card"
                    />
                    <ListItem
                      leftIcon="globe"
                      title="Destination Country"
                      subtitle={selectedReferral.country}
                      isLast={false}
                      variant="card"
                    />
                    <ListItem
                      leftIcon="cash"
                      title="Commission Amount"
                      subtitle={`$${selectedReferral.commissionAmount}`}
                      rightElement={
                        <Text fontSize="sm" color="success.600" fontWeight="bold">
                          ${selectedReferral.commissionAmount}
                        </Text>
                      }
                      isLast={false}
                      variant="card"
                    />
                    <ListItem
                      leftIcon="calendar"
                      title="Submission Date"
                      subtitle={selectedReferral.submissionDate}
                      isLast={true}
                      variant="card"
                    />
                  </VStack>
                </FormSection>
              </VStack>
            )}
          </Modal.Body>
          <Modal.Footer borderTopWidth={0} pt={4}>
            <Button
              w="full"
              variant="outline"
              colorScheme="gray"
              onPress={onClose}
              borderRadius="xl"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon="person-add"
        onPress={() => setShowNewReferralModal(true)}
        colorScheme="primary"
        label="New Referral"
      />
    </Box>
  );
};

export default ReferralsScreen; 