import React from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FacebookCampaigns } from './FacebookCampaigns'
import { InstagramInsights } from './InstagramInsights'
import { GoogleAdsStats } from './GoogleAdsStats'

export const SocialMediaDashboard: React.FC = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading size="lg" mb={2}>לוח בקרת רשתות חברתיות</Heading>
          <Text color="gray.600">
            ניהול וניטור קמפיינים ופעילות ברשתות החברתיות
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <FacebookCampaigns />
          <InstagramInsights />
        </SimpleGrid>

        <GoogleAdsStats />
      </Stack>
    </Container>
  )
} 