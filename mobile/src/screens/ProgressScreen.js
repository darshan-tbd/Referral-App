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
  Circle,
  Center,
  Pressable,
  IconButton,
  Heading,
  StatusBar,
} from 'native-base';
import { RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/mockData';
import { 
  PageHeader,
  MetricCard,
  InfoCard,
  EmptyState,
  SkeletonLoader,
  TimelineStep,
  ProgressIndicator,
  StatusBadge,
  FloatingActionButton
} from '../components/common/UIComponents';

const { width: screenWidth } = Dimensions.get('window');

const ProgressScreen = () => {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  
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
        title: 'Error loading progress',
        description: 'Failed to load progress data. Please try again.',
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
    await loadProgressData();
    setIsRefreshing(false);
  };

  const ProgressOverview = ({ user, overallProgress }) => (
    <InfoCard
      title="Application Progress"
      icon="analytics"
      color="primary"
      actions={[
        <Badge 
          key="progress"
          colorScheme="primary" 
          variant="solid" 
          borderRadius="full" 
          px={3} 
          py={1}
        >
          {Math.round(overallProgress)}%
        </Badge>
      ]}
    >
      <VStack space={4}>
        <HStack alignItems="center" justifyContent="space-between">
          <VStack>
            <Text fontSize="md" fontWeight="semibold" color="gray.800">
              {user?.visaType || 'Visa Application'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {user?.country || 'Processing destination'}
            </Text>
          </VStack>
          <VStack alignItems="flex-end">
            <Text fontSize="sm" color="gray.500">
              Current Stage
            </Text>
            <Text fontSize="md" fontWeight="semibold" color="primary.600">
              {user?.progress?.current || 1} of {user?.progress?.stages?.length || 5}
            </Text>
          </VStack>
        </HStack>
        
        <ProgressIndicator
          value={overallProgress}
          max={100}
          colorScheme="primary"
          size="lg"
          showPercentage={true}
          label="Overall Progress"
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

  const ProgressStats = ({ stages }) => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800">
          Progress Summary
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Stage breakdown
        </Text>
      </HStack>
      
      <HStack space={3}>
        <MetricCard
          title="Completed"
          value={stages.filter(s => s.status === 'completed').length}
          subtitle="stages"
          icon="checkmark-circle"
          color="success"
          size="sm"
          trend={{ positive: true, value: `${stages.filter(s => s.status === 'completed').length}` }}
        />
        <MetricCard
          title="In Progress"
          value={stages.filter(s => s.status === 'in_progress').length}
          subtitle="stage"
          icon="time"
          color="primary"
          size="sm"
          isHighlighted={stages.filter(s => s.status === 'in_progress').length > 0}
        />
        <MetricCard
          title="Remaining"
          value={stages.filter(s => s.status === 'pending').length}
          subtitle="stages"
          icon="ellipse"
          color="warning"
          size="sm"
        />
      </HStack>
    </VStack>
  );

  const ApplicationTimeline = ({ stages }) => (
    <InfoCard
      title="Application Timeline"
      icon="calendar"
      color="success"
    >
      <VStack space={4}>
        {stages.map((stage, index) => (
          <TimelineStep
            key={stage.id}
            step={{
              title: stage.name,
              description: stage.description || `Stage ${index + 1} of your application`,
              timestamp: stage.date || (stage.status === 'completed' ? 'Completed' : stage.status === 'in_progress' ? 'In Progress' : 'Pending')
            }}
            isActive={stage.status === 'in_progress'}
            isCompleted={stage.status === 'completed'}
            isLast={index === stages.length - 1}
          />
        ))}
      </VStack>
    </InfoCard>
  );

  const KeyMilestones = () => {
    const milestones = [
      { 
        title: 'Application Submitted', 
        description: 'Your application has been received and is being processed', 
        date: '2024-01-15', 
        completed: true 
      },
      { 
        title: 'Document Review', 
        description: 'All submitted documents are under review', 
        date: '2024-01-20', 
        completed: true 
      },
      { 
        title: 'Interview Scheduled', 
        description: 'Interview appointment has been confirmed', 
        date: '2024-02-01', 
        completed: false, 
        active: true 
      },
      { 
        title: 'Final Decision', 
        description: 'Final approval decision will be made', 
        date: 'Pending', 
        completed: false 
      },
    ];

    return (
      <InfoCard
        title="Key Milestones"
        icon="trophy"
        color="warning"
      >
        <VStack space={4}>
          {milestones.map((milestone, index) => (
            <HStack key={index} alignItems="flex-start" space={4}>
              <VStack alignItems="center" space={1}>
                <Circle
                  size={12}
                  bg={milestone.completed ? 'success.500' : milestone.active ? 'primary.500' : 'gray.300'}
                  shadow={milestone.active ? 'md' : 'sm'}
                >
                  <Ionicons 
                    name={milestone.completed ? 'checkmark' : milestone.active ? 'time' : 'ellipse'} 
                    size={20} 
                    color="white" 
                  />
                </Circle>
                {index < milestones.length - 1 && (
                  <Box
                    w={0.5}
                    h={12}
                    bg={milestone.completed ? 'success.300' : 'gray.200'}
                  />
                )}
              </VStack>
              
              <VStack flex={1} space={1}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="md" fontWeight="semibold" color="gray.800">
                    {milestone.title}
                  </Text>
                  <StatusBadge 
                    status={milestone.completed ? 'completed' : milestone.active ? 'in_progress' : 'pending'} 
                    variant="solid" 
                    size="sm"
                  />
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  {milestone.description}
                </Text>
                {milestone.date && (
                  <Text fontSize="xs" color="gray.500">
                    {milestone.date}
                  </Text>
                )}
              </VStack>
            </HStack>
          ))}
        </VStack>
      </InfoCard>
    );
  };

  const ApplicationStages = ({ stages }) => (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Heading fontSize="lg" fontWeight="bold" color="gray.800">
          Application Stages
        </Heading>
        <Text fontSize="sm" color="gray.500">
          {stages.length} total stages
        </Text>
      </HStack>
      
      <VStack space={3}>
        {stages.map((stage, index) => {
          const isActive = stage.status === 'in_progress';
          const isCompleted = stage.status === 'completed';
          const isUpcoming = stage.status === 'pending';

          return (
            <Pressable key={stage.id} onPress={() => setSelectedStage(stage)}>
              <Card
                bg={isActive ? 'primary.50' : isCompleted ? 'success.50' : 'white'}
                borderRadius="2xl"
                p={5}
                variant={isActive ? 'elevated' : 'outlined'}
                borderColor={isActive ? 'primary.200' : isCompleted ? 'success.200' : 'gray.200'}
                _pressed={{ opacity: 0.8 }}
              >
                <HStack alignItems="center" space={4}>
                  <Box position="relative">
                    <Circle
                      size={14}
                      bg={isCompleted ? 'success.500' : isActive ? 'primary.500' : 'gray.300'}
                      shadow={isActive || isCompleted ? 'md' : 'sm'}
                    >
                      <Ionicons 
                        name={isCompleted ? 'checkmark-circle' : isActive ? 'time' : 'ellipse-outline'} 
                        size={24} 
                        color="white" 
                      />
                    </Circle>
                    {isActive && (
                      <Circle
                        size={4}
                        bg="warning.500"
                        position="absolute"
                        top={-1}
                        right={-1}
                        borderWidth={2}
                        borderColor="white"
                      />
                    )}
                  </Box>
                  
                  <VStack flex={1} space={2}>
                    <HStack alignItems="center" justifyContent="space-between">
                      <VStack>
                        <Text fontSize="md" fontWeight="bold" color="gray.800">
                          Stage {index + 1}: {stage.name}
                        </Text>
                        {stage.description && (
                          <Text fontSize="sm" color="gray.600">
                            {stage.description}
                          </Text>
                        )}
                      </VStack>
                      <StatusBadge 
                        status={stage.status} 
                        variant="solid" 
                        size="sm"
                      />
                    </HStack>
                    
                    {stage.date && (
                      <Text fontSize="sm" color="gray.500">
                        {isCompleted ? 'Completed on' : isActive ? 'Started on' : 'Expected'}: {stage.date}
                      </Text>
                    )}
                    
                    {isActive && stage.progress && (
                      <ProgressIndicator
                        value={stage.progress}
                        max={100}
                        colorScheme="primary"
                        size="sm"
                        showPercentage={true}
                        label="Stage Progress"
                      />
                    )}
                  </VStack>
                  
                  <IconButton
                    icon={<Ionicons name="chevron-forward" size={20} color="gray.400" />}
                    onPress={() => setSelectedStage(stage)}
                    size="sm"
                    variant="ghost"
                  />
                </HStack>
              </Card>
            </Pressable>
          );
        })}
      </VStack>
    </VStack>
  );

  const HelpSection = () => (
    <InfoCard
      title="Need Assistance?"
      icon="help-circle"
      color="primary"
      variant="subtle"
    >
      <VStack space={4} alignItems="center">
        <VStack alignItems="center" space={2}>
          <Text fontSize="md" color="gray.600" textAlign="center">
            Have questions about your application progress?
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Our support team is here to help you navigate the process.
          </Text>
        </VStack>
        
        <HStack space={3}>
          <Button
            variant="outline"
            colorScheme="primary"
            borderRadius="xl"
            size="sm"
            leftIcon={<Ionicons name="call" size={16} color="#3B82F6" />}
            onPress={() => {
              toast.show({
                title: 'Call Support',
                description: 'Call us at +1-800-SUPPORT',
                status: 'info',
                duration: 3000,
                placement: 'top',
              });
            }}
          >
            Call Support
          </Button>
          
          <Button
            colorScheme="primary"
            borderRadius="xl"
            size="sm"
            leftIcon={<Ionicons name="mail" size={16} color="white" />}
            onPress={() => {
              toast.show({
                title: 'Email Support',
                description: 'Contact us at support@referralpro.com',
                status: 'info',
                duration: 3000,
                placement: 'top',
              });
            }}
          >
            Email Us
          </Button>
        </HStack>
      </VStack>
    </InfoCard>
  );

  const LoadingSkeleton = () => (
    <Box flex={1} bg="background.secondary" safeArea>
      <VStack space={6} p={6}>
        <SkeletonLoader lines={1} height={12} />
        <SkeletonLoader lines={1} height={16} />
        <HStack space={3}>
          <SkeletonLoader lines={1} height={20} />
          <SkeletonLoader lines={1} height={20} />
          <SkeletonLoader lines={1} height={20} />
        </HStack>
        <SkeletonLoader lines={1} height={20} />
        <SkeletonLoader lines={4} height={16} />
        <SkeletonLoader lines={3} height={20} />
      </VStack>
    </Box>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stages = user?.progress?.stages || [
    { id: 1, name: 'Application Submitted', status: 'completed', date: '2024-01-15' },
    { id: 2, name: 'Document Review', status: 'completed', date: '2024-01-20' },
    { id: 3, name: 'Interview Process', status: 'in_progress', date: '2024-02-01', progress: 65 },
    { id: 4, name: 'Background Check', status: 'pending', date: 'Pending' },
    { id: 5, name: 'Final Decision', status: 'pending', date: 'Pending' },
  ];
  
  const currentStage = user?.progress?.current || 3;
  const overallProgress = (currentStage / stages.length) * 100;

  return (
    <Box flex={1} bg="background.secondary">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      <PageHeader
        title="Progress Tracker"
        subtitle="Track your application journey"
        variant="gradient"
        actions={[
          <IconButton
            key="refresh"
            icon={<Ionicons name="refresh" size={20} color="white" />}
            onPress={handleRefresh}
            bg="transparent"
            _pressed={{ bg: 'white', opacity: 0.2 }}
            isLoading={isRefreshing}
          />
        ]}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <VStack space={6} p={6}>
          {/* Progress Overview */}
          <ProgressOverview user={user} overallProgress={overallProgress} />

          {/* Progress Stats */}
          <ProgressStats stages={stages} />

          {/* Key Milestones */}
          <KeyMilestones />

          {/* Application Timeline */}
          <ApplicationTimeline stages={stages} />

          {/* Application Stages */}
          <ApplicationStages stages={stages} />

          {/* Help Section */}
          <HelpSection />
        </VStack>
      </ScrollView>

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

export default ProgressScreen; 