import React from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AffiliateService } from '@/client'
import { FaShareAlt, FaCopy } from 'react-icons/fa'

export const ReferralSystem: React.FC = () => {
  const toast = useToast()
  const { data: referralData, isLoading } = useQuery({
    queryKey: ['referralData'],
    queryFn: () => AffiliateService.getReferralData(),
  })

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'הועתק בהצלחה!',
        status: 'success',
        duration: 2000,
      })
    } catch (err) {
      toast({
        title: 'שגיאה בהעתקה',
        status: 'error',
        duration: 2000,
      })
    }
  }

  const shareMutation = useMutation({
    mutationFn: () => AffiliateService.shareReferralLink(),
    onSuccess: () => {
      toast({
        title: 'קישור שותף בהצלחה!',
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
        <Heading size="md">מערכת הפניות</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="bold" mb={2}>
              קישור הפניה שלך:
            </Text>
            <Stack direction="row" spacing={2}>
              <Text flex={1} p={2} bg="gray.100" borderRadius="md">
                {referralData?.referralLink}
              </Text>
              <Button
                leftIcon={<FaCopy />}
                onClick={() => copyToClipboard(referralData?.referralLink || '')}
              >
                העתק
              </Button>
            </Stack>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>
              קוד הפניה:
            </Text>
            <Stack direction="row" spacing={2}>
              <Text flex={1} p={2} bg="gray.100" borderRadius="md">
                {referralData?.referralCode}
              </Text>
              <Button
                leftIcon={<FaCopy />}
                onClick={() => copyToClipboard(referralData?.referralCode || '')}
              >
                העתק
              </Button>
            </Stack>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>
              סטטיסטיקות:
            </Text>
            <Stack direction="row" spacing={4}>
              <Box flex={1} p={3} bg="blue.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  הפניות פעילות
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  {referralData?.activeReferrals}
                </Text>
              </Box>
              <Box flex={1} p={3} bg="green.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  רווחים
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  ₪{referralData?.earnings}
                </Text>
              </Box>
            </Stack>
          </Box>

          <Button
            leftIcon={<FaShareAlt />}
            colorScheme="blue"
            onClick={() => shareMutation.mutate()}
            isLoading={shareMutation.isPending}
          >
            שתף קישור הפניה
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
} 