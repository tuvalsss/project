import React from 'react'
import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react'
import { ReferralSystem } from '@/components/Affiliate/ReferralSystem'
import { ReferralsList } from '@/components/Affiliate/ReferralsList'
import { PaymentsHistory } from '@/components/Affiliate/PaymentsHistory'
import { AffiliateSettings } from '@/components/Affiliate/AffiliateSettings'
import { ChatWidget } from '@/components/AI/ChatWidget'
import { createFileRoute } from '@tanstack/react-router'
import { AffiliateDashboard } from '@/components/Affiliate/AffiliateDashboard'

export const Route = createFileRoute('/_layout/affiliate')({
  component: AffiliateDashboard,
})

export default function AffiliatePage() {
  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading size="lg" mb={2}>
            מערכת שותפים
          </Heading>
          <Text color="gray.600">
            ניהול הפניות, תשלומים והגדרות שותפים
          </Text>
        </Box>

        <Stack spacing={6}>
          <ReferralSystem />
          <ReferralsList />
          <PaymentsHistory />
          <AffiliateSettings />
        </Stack>

        <ChatWidget />
      </Stack>
    </Container>
  )
} 