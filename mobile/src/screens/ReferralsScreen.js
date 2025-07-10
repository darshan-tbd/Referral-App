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
  Skeleton,
  Fab,
  AlertDialog,
  Actionsheet,
  useDisclose,
} from 'native-base';
import { RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { referralService, mockData } from '../services/mockData';

const ReferralsScreen = () => {
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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
        title: 'Error',
        description: 'Failed to load referrals',
        status: 'error',
        duration: 3000,
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
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
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
          title: 'Success',
          description: 'Referral submitted successfully!',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        description: error.message || 'Failed to submit referral',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'in_progress': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return 'checkmark-circle';
      case 'rejected': return 'close-circle';
      case 'in_progress': return 'time';
      default: return 'ellipse';
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesStatus = filterStatus === 'all' || referral.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      referral.refereeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.refereeEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  const ReferralCard = ({ referral }) => (
    <Card bg="white" borderRadius="xl" p={4} mb={3}>
      <VStack space={3}>
        <HStack alignItems="center" justifyContent="space-between">
          <HStack alignItems="center" space={3}>
            <Box bg="primary.500" p={2} borderRadius="full">
              <Ionicons name="person" size={16} color="white" />
            </Box>
            <VStack>
              <Text fontSize="md" fontWeight="bold" color="gray.700">
                {referral.refereeName}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {referral.refereeEmail}
              </Text>
            </VStack>
          </HStack>
          <Badge
            colorScheme={getStatusColor(referral.status)}
            variant="solid"
            borderRadius="full"
          >
            {referral.status}
          </Badge>
        </HStack>
        
        <HStack alignItems="center" space={4}>
          <VStack flex={1}>
            <Text fontSize="xs" color="gray.400">
              Visa Type
            </Text>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {referral.visaType}
            </Text>
          </VStack>
          <VStack flex={1}>
            <Text fontSize="xs" color="gray.400">
              Country
            </Text>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {referral.country}
            </Text>
          </VStack>
          <VStack flex={1}>
            <Text fontSize="xs" color="gray.400">
              Commission
            </Text>
            <Text fontSize="sm" color="green.600" fontWeight="medium">
              ${referral.commissionAmount}
            </Text>
          </VStack>
        </HStack>
        
        <HStack alignItems="center" justifyContent="space-between">
          <Text fontSize="xs" color="gray.400">
            Submitted: {referral.submissionDate}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="primary"
            onPress={() => {
              setSelectedReferral(referral);
              onOpen();
            }}
          >
            View Details
          </Button>
        </HStack>
      </VStack>
    </Card>
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

  const stats = {
    total: referrals.length,
    approved: referrals.filter(r => r.status === 'approved').length,
    pending: referrals.filter(r => r.status === 'pending').length,
    inProgress: referrals.filter(r => r.status === 'in_progress').length,
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
          {/* Stats Cards */}
          <HStack space={2}>
            <StatCard
              title="Total Referrals"
              value={stats.total}
              icon="people"
              color="blue"
            />
            <StatCard
              title="Approved"
              value={stats.approved}
              icon="checkmark-circle"
              color="green"
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon="time"
              color="orange"
            />
          </HStack>

          {/* Search and Filter */}
          <VStack space={3}>
            <Input
              placeholder="Search referrals..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              InputLeftElement={
                <Box ml={3}>
                  <Ionicons name="search" size={20} color="gray" />
                </Box>
              }
              size="lg"
              borderRadius="lg"
              bg="white"
            />
            
            <Select
              selectedValue={filterStatus}
              onValueChange={setFilterStatus}
              placeholder="Filter by status"
              size="lg"
              borderRadius="lg"
              bg="white"
            >
              <Select.Item label="All Statuses" value="all" />
              <Select.Item label="Pending" value="pending" />
              <Select.Item label="In Progress" value="in_progress" />
              <Select.Item label="Approved" value="approved" />
              <Select.Item label="Rejected" value="rejected" />
            </Select>
          </VStack>

          {/* Referrals List */}
          <VStack space={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Your Referrals ({filteredReferrals.length})
              </Text>
              <Button
                size="sm"
                colorScheme="primary"
                onPress={() => setShowNewReferralModal(true)}
                leftIcon={<Ionicons name="add" size={16} />}
              >
                New Referral
              </Button>
            </HStack>

            {filteredReferrals.length === 0 ? (
              <Card bg="white" borderRadius="xl" p={6}>
                <VStack alignItems="center" space={4}>
                  <Box bg="gray.100" p={4} borderRadius="full">
                    <Ionicons name="people" size={32} color="gray" />
                  </Box>
                  <Text fontSize="lg" fontWeight="medium" color="gray.600" textAlign="center">
                    No referrals found
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Start referring friends and family to earn commissions
                  </Text>
                  <Button
                    colorScheme="primary"
                    onPress={() => setShowNewReferralModal(true)}
                    leftIcon={<Ionicons name="add" size={16} />}
                  >
                    Create First Referral
                  </Button>
                </VStack>
              </Card>
            ) : (
              <VStack space={0}>
                {filteredReferrals.map((referral) => (
                  <ReferralCard key={referral.id} referral={referral} />
                ))}
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      {/* Floating Action Button */}
      <Fab
        bg="primary.500"
        icon={<Ionicons name="add" size={24} color="white" />}
        onPress={() => setShowNewReferralModal(true)}
        position="absolute"
        bottom={4}
        right={4}
      />

      {/* New Referral Modal */}
      <Modal isOpen={showNewReferralModal} onClose={() => setShowNewReferralModal(false)} size="full">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>New Referral</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <FormControl isRequired>
                <FormControl.Label>Full Name</FormControl.Label>
                <Input
                  value={newReferral.refereeName}
                  onChangeText={(text) => setNewReferral({...newReferral, refereeName: text})}
                  placeholder="Enter referee's full name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Email Address</FormControl.Label>
                <Input
                  value={newReferral.refereeEmail}
                  onChangeText={(text) => setNewReferral({...newReferral, refereeEmail: text})}
                  placeholder="Enter referee's email"
                  keyboardType="email-address"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Phone Number</FormControl.Label>
                <Input
                  value={newReferral.refereePhone}
                  onChangeText={(text) => setNewReferral({...newReferral, refereePhone: text})}
                  placeholder="Enter referee's phone"
                  keyboardType="phone-pad"
                />
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Visa Type</FormControl.Label>
                <Select
                  selectedValue={newReferral.visaType}
                  onValueChange={(value) => setNewReferral({...newReferral, visaType: value})}
                  placeholder="Select visa type"
                >
                  {mockData.visaTypes.map((type) => (
                    <Select.Item key={type.id} label={type.name} value={type.name} />
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Country</FormControl.Label>
                <Select
                  selectedValue={newReferral.country}
                  onValueChange={(value) => setNewReferral({...newReferral, country: value})}
                  placeholder="Select country"
                >
                  {mockData.countries.map((country) => (
                    <Select.Item key={country.id} label={country.name} value={country.name} />
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormControl.Label>Additional Notes</FormControl.Label>
                <TextArea
                  value={newReferral.notes}
                  onChangeText={(text) => setNewReferral({...newReferral, notes: text})}
                  placeholder="Any additional information..."
                  h={20}
                />
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => setShowNewReferralModal(false)}
              >
                Cancel
              </Button>
              <Button onPress={handleSubmitReferral}>
                Submit Referral
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Referral Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Referral Details</Modal.Header>
          <Modal.Body>
            {selectedReferral && (
              <VStack space={4}>
                <HStack alignItems="center" space={3}>
                  <Box bg="primary.500" p={3} borderRadius="full">
                    <Ionicons name="person" size={24} color="white" />
                  </Box>
                  <VStack>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">
                      {selectedReferral.refereeName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {selectedReferral.refereeEmail}
                    </Text>
                  </VStack>
                </HStack>

                <VStack space={3}>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize="sm" color="gray.600">Status:</Text>
                    <Badge
                      colorScheme={getStatusColor(selectedReferral.status)}
                      variant="solid"
                      borderRadius="full"
                    >
                      {selectedReferral.status}
                    </Badge>
                  </HStack>

                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize="sm" color="gray.600">Visa Type:</Text>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      {selectedReferral.visaType}
                    </Text>
                  </HStack>

                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize="sm" color="gray.600">Country:</Text>
                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                      {selectedReferral.country}
                    </Text>
                  </HStack>

                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize="sm" color="gray.600">Commission:</Text>
                    <Text fontSize="sm" color="green.600" fontWeight="bold">
                      ${selectedReferral.commissionAmount}
                    </Text>
                  </HStack>

                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize="sm" color="gray.600">Submitted:</Text>
                    <Text fontSize="sm" color="gray.700">
                      {selectedReferral.submissionDate}
                    </Text>
                  </HStack>

                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize="sm" color="gray.600">Assigned To:</Text>
                    <Text fontSize="sm" color="gray.700">
                      {selectedReferral.assignedTo}
                    </Text>
                  </HStack>

                  {selectedReferral.notes && (
                    <VStack space={1}>
                      <Text fontSize="sm" color="gray.600">Notes:</Text>
                      <Text fontSize="sm" color="gray.700">
                        {selectedReferral.notes}
                      </Text>
                    </VStack>
                  )}
                </VStack>
              </VStack>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default ReferralsScreen; 