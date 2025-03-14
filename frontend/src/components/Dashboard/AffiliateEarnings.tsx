import React from "react"
import { Box, Heading, Text, VStack, HStack, Divider, Button } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { AffiliateService } from "@/client"
import { FiTrendingUp, FiDollarSign, FiUsers } from "react-icons/fi"

export const AffiliateEarnings = () => {
  const { data: earnings } = useQuery({
    queryKey: ["affiliateEarnings"],
    queryFn: () => AffiliateService.getEarnings(),
  })

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.100">
      <HStack justify="space-between" mb={6}>
        <Heading size="md">הכנסות שותפים</Heading>
        <Button size="sm" colorScheme="blue" variant="outline">
          צפה בכל ההכנסות
        </Button>
      </HStack>

      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text color="gray.600">סה"כ הכנסות החודש</Text>
            <Text fontSize="2xl" fontWeight="bold">
              ₪{earnings?.monthly_total || 0}
            </Text>
          </VStack>
          <Box p={3} bg="green.50" borderRadius="full">
            <FiTrendingUp color="green" size={24} />
          </Box>
        </HStack>

        <Divider />

        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text color="gray.600">הכנסות ממוצעות לשותף</Text>
            <Text fontSize="xl" fontWeight="bold">
              ₪{earnings?.average_per_affiliate || 0}
            </Text>
          </VStack>
          <Box p={3} bg="blue.50" borderRadius="full">
            <FiDollarSign color="blue" size={24} />
          </Box>
        </HStack>

        <Divider />

        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text color="gray.600">שותפים פעילים</Text>
            <Text fontSize="xl" fontWeight="bold">
              {earnings?.active_affiliates || 0}
            </Text>
          </VStack>
          <Box p={3} bg="purple.50" borderRadius="full">
            <FiUsers color="purple" size={24} />
          </Box>
        </HStack>

        <Box mt={4} p={4} bg="gray.50" borderRadius="md">
          <Text fontWeight="bold" mb={2}>
            שותפים מובילים החודש
          </Text>
          <VStack align="stretch" spacing={3}>
            {earnings?.top_affiliates?.map((affiliate, index) => (
              <HStack key={index} justify="space-between">
                <Text>{affiliate.name}</Text>
                <Text fontWeight="bold">₪{affiliate.earnings}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
} 