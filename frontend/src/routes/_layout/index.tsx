import React from 'react'
import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Flex,
  VStack,
  Divider,
  Button,
} from '@chakra-ui/react'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { ChatWidget } from '@/components/AI/ChatWidget'
import { CampaignStats } from '@/components/Dashboard/CampaignStats'
import { AiInsights } from '@/components/Dashboard/AiInsights'
import { AffiliateEarnings } from '@/components/Dashboard/AffiliateEarnings'
import useAuth from '@/hooks/useAuth'
import { FaHome, FaChartBar, FaUsers, FaShareAlt, FaCog, FaFacebook, FaInstagram, FaGoogle } from 'react-icons/fa'

export const Route = createFileRoute('/_layout/')({
  component: Layout,
})

const navigationItems = [
  { name: 'דף הבית', icon: FaHome, path: '/' },
  { name: 'קמפיינים', icon: FaChartBar, path: '/campaigns' },
  { name: 'רשתות חברתיות', icon: FaShareAlt, path: '/social' },
  { name: 'ממליצים', icon: FaUsers, path: '/affiliate' },
  { name: 'הגדרות', icon: FaCog, path: '/settings' },
]

function Layout() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex>
        <Box
          w="64"
          bg="white"
          borderRight="1px"
          borderColor="gray.200"
          py={4}
          position="fixed"
          h="100vh"
        >
          <VStack spacing={4} align="stretch">
            <Box px={4}>
              <Heading size="md">מערכת ניהול קמפיינים</Heading>
            </Box>
            <Divider />
            <VStack spacing={1} align="stretch">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<Box as={item.icon} />}
                  onClick={() => navigate({ to: item.path })}
                >
                  {item.name}
                </Button>
              ))}
            </VStack>
          </VStack>
        </Box>
        <Box flex={1} ml="64">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  )
}

function HomePage() {
  const { user: currentUser } = useAuth()

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading size="lg" mb={2}>
            שלום, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Heading>
          <Text color="gray.600">
            ברוך הבא בחזרה, נעים לראות אותך שוב!
          </Text>
        </Box>

        <Stack spacing={6}>
          {/* סטטיסטיקות קמפיינים */}
          <CampaignStats />

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* תובנות AI */}
            <AiInsights />

            {/* רווחי שותפים */}
            <AffiliateEarnings />
          </SimpleGrid>
        </Stack>

        <ChatWidget />
      </Stack>
    </Container>
  )
}
