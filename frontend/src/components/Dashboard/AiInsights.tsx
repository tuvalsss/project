import React from "react"
import { Box, Heading, Text, VStack, HStack, Badge, Progress, SimpleGrid } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { CampaignsService } from "@/client"

export const AiInsights = () => {
  const { data: aiAnalysis } = useQuery({
    queryKey: ["aiAnalysis"],
    queryFn: () => CampaignsService.getAiAnalysis(),
  })

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.100">
      <Heading size="md" mb={6}>תובנות AI</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <VStack align="stretch" spacing={4}>
          <Box>
            <Text fontWeight="bold" mb={2}>ציון ביצועים כללי</Text>
            <Progress
              value={aiAnalysis?.performance_score || 0}
              colorScheme={
                (aiAnalysis?.performance_score || 0) > 70
                  ? "green"
                  : (aiAnalysis?.performance_score || 0) > 40
                  ? "yellow"
                  : "red"
              }
              borderRadius="full"
              size="lg"
              mb={2}
            />
            <Text fontSize="sm" color="gray.600">
              {aiAnalysis?.performance_score || 0}% - {aiAnalysis?.performance_status || "טוב"}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>תחומים לשיפור</Text>
            <VStack align="stretch">
              {aiAnalysis?.improvement_areas?.map((area, index) => (
                <HStack key={index} spacing={2}>
                  <Badge colorScheme="red" variant="subtle">
                    {area.priority}
                  </Badge>
                  <Text fontSize="sm">{area.description}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>

        <VStack align="stretch" spacing={4}>
          <Box>
            <Text fontWeight="bold" mb={2}>המלצות מערכת</Text>
            <VStack align="stretch">
              {aiAnalysis?.recommendations?.map((recommendation, index) => (
                <Box
                  key={index}
                  p={3}
                  bg="blue.50"
                  borderRadius="md"
                  borderRight="4px"
                  borderColor="blue.500"
                >
                  <Text fontSize="sm">{recommendation}</Text>
                </Box>
              ))}
            </VStack>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>תובנות עיקריות</Text>
            <VStack align="stretch">
              {aiAnalysis?.key_insights?.map((insight, index) => (
                <HStack key={index} spacing={2}>
                  <Badge colorScheme="green" variant="subtle">
                    {insight.category}
                  </Badge>
                  <Text fontSize="sm">{insight.description}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </SimpleGrid>
    </Box>
  )
} 