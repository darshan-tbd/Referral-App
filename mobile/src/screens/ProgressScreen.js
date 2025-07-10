import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  ScrollView,
  Card,
  Progress,
  Badge,
  Button,
  Divider,
  useToast,
  Skeleton,
  Circle,
} from 'native-base';
import { RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/mockData';

const ProgressScreen = () => {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getDashboardData(user?.id);
      if (response.success) {
        setProgressData(response.data);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to load progress data',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProgressData();
    setIsRefreshing(false);
  };

  const StageCard = ({ stage, isActive, isCompleted, isUpcoming, index }) => {
    const getStageColor = () => {
      if (isCompleted) return 'green';
      if (isActive) return 'blue';
      return 'gray';
    };

    const getStageIcon = () => {
      if (isCompleted) return 'checkmark-circle';
      if (isActive) return 'time';
      return 'ellipse-outline';
    };

    return (
      <Card
        bg={isActive ? 'blue.50' : isCompleted ? 'green.50' : 'gray.50'}
        borderRadius="xl"
        p={4}
        mb={3}
        borderWidth={isActive ? 2 : 1}
        borderColor={isActive ? 'blue.500' : isCompleted ? 'green.500' : 'gray.200'}
      >
        <HStack alignItems="center" space={4}>
          <Box
            bg={`${getStageColor()}.500`}
            p={3}
            borderRadius="full"
            position="relative"
          >
            <Ionicons name={getStageIcon()} size={24} color="white" />
            {isActive && (
              <Box
                position="absolute"
                top={-1}
                right={-1}
                bg="orange.500"
                w={3}
                h={3}
                borderRadius="full"
              />
            )}
          </Box>
          
          <VStack flex={1} space={1}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Stage {index + 1}
              </Text>
              <Badge
                colorScheme={getStageColor()}
                variant={isCompleted || isActive ? 'solid' : 'outline'}
                borderRadius="full"
              >
                {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
              </Badge>
            </HStack>
            
            <Text fontSize="md" fontWeight="medium" color="gray.600">
              {stage.name}
            </Text>
            
            {stage.date && (
              <Text fontSize="sm" color="gray.500">
                {isCompleted ? 'Completed on' : 'Started on'}: {stage.date}
              </Text>
            )}
            
            {isActive && (
              <Text fontSize="sm" color="blue.600" fontWeight="medium">
                Currently processing...
              </Text>
            )}
          </VStack>
        </HStack>
      </Card>
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

  if (isLoading) {
    return (
      <Box flex={1} bg="gray.50" safeArea>
        <ScrollView>
          <VStack space={4} p={4}>
            <Skeleton h="24" borderRadius="xl" />
            <HStack space={3}>
              <Skeleton h="32" flex={1} borderRadius="xl" />
              <Skeleton h="32" flex={1} borderRadius="xl" />
              <Skeleton h="32" flex={1} borderRadius="xl" />
            </HStack>
            <Skeleton h="20" borderRadius="xl" />
            <Skeleton h="24" borderRadius="xl" />
            <Skeleton h="24" borderRadius="xl" />
            <Skeleton h="24" borderRadius="xl" />
          </VStack>
        </ScrollView>
      </Box>
    );
  }

  const stages = user?.progress?.stages || [];
  const currentStage = user?.progress?.current || 1;
  const overallProgress = (currentStage / stages.length) * 100;

  return (
    <Box flex={1} bg="gray.50" safeArea>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <VStack space={4} p={4}>
          {/* Header Card */}
          <Card bg="primary.500" borderRadius="xl" p={6}>
            <VStack space={4}>
              <HStack alignItems="center" justifyContent="space-between">
                <VStack>
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    Application Progress
                  </Text>
                  <Text fontSize="sm" color="primary.100">
                    {user?.visaType || 'Visa Application'} - {user?.country || 'Country'}
                  </Text>
                </VStack>
                <Badge colorScheme="white" variant="solid" borderRadius="full">
                  {Math.round(overallProgress)}%
                </Badge>
              </HStack>
              
              <VStack space={2}>
                <Progress
                  value={overallProgress}
                  colorScheme="white"
                  size="lg"
                  borderRadius="full"
                  bg="primary.400"
                />
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" color="primary.100">
                    Stage {currentStage} of {stages.length}
                  </Text>
                  <Text fontSize="sm" color="white" fontWeight="medium">
                    {stages.find(s => s.id === currentStage)?.name || 'Processing'}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Card>

          {/* Summary Stats */}
          <HStack space={2}>
            <StatCard
              title="Completed"
              value={stages.filter(s => s.status === 'completed').length}
              subtitle="stages"
              icon="checkmark-circle"
              color="green"
            />
            <StatCard
              title="In Progress"
              value={stages.filter(s => s.status === 'in_progress').length}
              subtitle="stage"
              icon="time"
              color="blue"
            />
            <StatCard
              title="Remaining"
              value={stages.filter(s => s.status === 'pending').length}
              subtitle="stages"
              icon="ellipse"
              color="gray"
            />
          </HStack>

          {/* Estimated Timeline */}
          <Card bg="white" borderRadius="xl" p={4}>
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  Estimated Timeline
                </Text>
                <Badge colorScheme="orange" variant="subtle" borderRadius="full">
                  2-3 weeks remaining
                </Badge>
              </HStack>
              
              <VStack space={2}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Application Startedaa
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Card>

          {/* Stage Progress */}
          <VStack space={3}>
            <Text fontSize="lg" fontWeight="bold" color="gray.700">
              Stage Details
            </Text>
            
            <VStack space={0}>
              {stages.map((stage, index) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isCompleted={stage.status === 'completed'}
                  isActive={stage.status === 'in_progress'}
                  isUpcoming={stage.status === 'pending'}
                />
              ))}
            </VStack>
          </VStack>

          {/* Next Steps */}
          <Card bg="blue.50" borderRadius="xl" p={4}>
            <VStack space={3}>
              <HStack alignItems="center" space={3}>
                <Box bg="blue.500" p={2} borderRadius="full">
                  <Ionicons name="information-circle" size={20} color="white" />
                </Box>
                <Text fontSize="lg" fontWeight="bold" color="blue.700">
                  Next Steps
                </Text>
              </HStack>
              
              <VStack space={2}>
                <Text fontSize="sm" color="blue.600">
                  • Review and submit any pending documents
                </Text>
                <Text fontSize="sm" color="blue.600">
                  • Respond to any requests from our team
                </Text>
                <Text fontSize="sm" color="blue.600">
                  • Keep your contact information updated
                </Text>
                <Text fontSize="sm" color="blue.600">
                  • Check notifications regularly for updates
                </Text>
              </VStack>
            </VStack>
          </Card>

          {/* Support Section */}
          <Card bg="gray.100" borderRadius="xl" p={4}>
            <VStack space={3} alignItems="center">
              <Box bg="primary.500" p={3} borderRadius="full">
                <Ionicons name="help-circle" size={24} color="white" />
              </Box>
              <Text fontSize="md" fontWeight="medium" color="gray.700" textAlign="center">
                Questions About Your Progress?
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Our team is here to help with any questions about your application status.
              </Text>
              <HStack space={2}>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="primary"
                  leftIcon={<Ionicons name="call" size={16} />}
                >
                  Call Support
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="primary"
                  leftIcon={<Ionicons name="chatbubble" size={16} />}
                >
                  Live Chat
                </Button>
              </HStack>
            </VStack>
          </Card>

          {/* Document Checklist */}
          <Card bg="white" borderRadius="xl" p={4}>
            <VStack space={3}>
              <Text fontSize="lg" fontWeight="bold" color="gray.700">
                Required Documents
              </Text>
              
              <VStack space={2}>
                <HStack alignItems="center" space={3}>
                  <Box bg="green.500" p={1} borderRadius="full">
                    <Ionicons name="checkmark" size={12} color="white" />
                  </Box>
                  <Text fontSize="sm" color="gray.600" flex={1}>
                    Passport Copy
                  </Text>
                  <Badge colorScheme="green" variant="solid" borderRadius="full">
                    Submitted
                  </Badge>
                </HStack>
                
                <HStack alignItems="center" space={3}>
                  <Box bg="green.500" p={1} borderRadius="full">
                    <Ionicons name="checkmark" size={12} color="white" />
                  </Box>
                  <Text fontSize="sm" color="gray.600" flex={1}>
                    Educational Certificates
                  </Text>
                  <Badge colorScheme="green" variant="solid" borderRadius="full">
                    Submitted
                  </Badge>
                </HStack>
                
                <HStack alignItems="center" space={3}>
                  <Box bg="orange.500" p={1} borderRadius="full">
                    <Ionicons name="time" size={12} color="white" />
                  </Box>
                  <Text fontSize="sm" color="gray.600" flex={1}>
                    Financial Documents
                  </Text>
                  <Badge colorScheme="orange" variant="solid" borderRadius="full">
                    Pending
                  </Badge>
                </HStack>
                
                <HStack alignItems="center" space={3}>
                  <Box bg="gray.400" p={1} borderRadius="full">
                    <Ionicons name="ellipse" size={12} color="white" />
                  </Box>
                  <Text fontSize="sm" color="gray.600" flex={1}>
                    Medical Certificate
                  </Text>
                  <Badge colorScheme="gray" variant="solid" borderRadius="full">
                    Not Required
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

export default ProgressScreen; 