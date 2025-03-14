import React from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  List,
  ListItem,
  Progress,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AiService } from '@/client'
import { FaChartLine, FaLightbulb, FaClock } from 'react-icons/fa'

export const AdOptimizer: React.FC = () => {
  const toast = useToast()
  const { data: optimizationData, isLoading } = useQuery({
    queryKey: ['adOptimization'],
    queryFn: () => AiService.getAdOptimization(),
  })

  const optimizeMutation = useMutation({
    mutationFn: () => AiService.optimizeAds(),
    onSuccess: () => {
      toast({
        title: 'הפרסומות עודכנו בהצלחה',
        status: 'success',
        duration: 2000,
      })
    },
  })

  if (isLoading) {
    return <Text>טוען...</Text>
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">אופטימיזציית פרסומות</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Text fontWeight="bold" mb={2}>
              ציון נוכחי
            </Text>
            <Progress
              value={optimizationData?.currentScore || 0}
              colorScheme="blue"
              size="lg"
              borderRadius="full"
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              {optimizationData?.currentScore}%
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>
              פוטנציאל לשיפור
            </Text>
            <Progress
              value={optimizationData?.potentialImprovement || 0}
              colorScheme="green"
              size="lg"
              borderRadius="full"
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              {optimizationData?.potentialImprovement}%
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2} display="flex" alignItems="center">
              <FaLightbulb style={{ marginLeft: '8px' }} />
              המלצות לשיפור
            </Text>
            <List spacing={2}>
              {optimizationData?.recommendations.map((rec, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <Text>{rec}</Text>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2} display="flex" alignItems="center">
              <FaClock style={{ marginLeft: '8px' }} />
              זמני פרסום מומלצים
            </Text>
            <List spacing={2}>
              {optimizationData?.suggestedTimes.map((time, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <Text>{time}</Text>
                </ListItem>
              ))}
            </List>
          </Box>

          <Button
            leftIcon={<FaChartLine />}
            colorScheme="blue"
            onClick={() => optimizeMutation.mutate()}
            isLoading={optimizeMutation.isPending}
          >
            אופטימיזציה אוטומטית
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
} 