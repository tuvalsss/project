import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Icon,
  useToast,
  Progress,
  Tooltip,
} from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaGoogle, FaLinkedin, FaTwitter, FaTiktok, FaSnapchat, FaPinterest } from 'react-icons/fa'
import { SocialMediaService, IntegrationStatus } from '../../client'

const platforms = [
  { name: 'Facebook', icon: FaFacebook, color: 'blue.500' },
  { name: 'Instagram', icon: FaInstagram, color: 'pink.500' },
  { name: 'Google Ads', icon: FaGoogle, color: 'red.500' },
  { name: 'LinkedIn', icon: FaLinkedin, color: 'blue.600' },
  { name: 'Twitter', icon: FaTwitter, color: 'blue.400' },
  { name: 'TikTok', icon: FaTiktok, color: 'black' },
  { name: 'Snapchat', icon: FaSnapchat, color: 'yellow.400' },
  { name: 'Pinterest', icon: FaPinterest, color: 'red.600' },
]

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      const data = await SocialMediaService.getIntegrationsStatus()
      setIntegrations(data)
    } catch (error) {
      toast({
        title: 'שגיאה בטעינת אינטגרציות',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (platform: string) => {
    try {
      await SocialMediaService.connectPlatform(platform)
      toast({
        title: 'החיבור בוצע בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      loadIntegrations()
    } catch (error) {
      toast({
        title: 'שגיאה בחיבור לפלטפורמה',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDisconnect = async (platform: string) => {
    try {
      await SocialMediaService.disconnectPlatform(platform)
      toast({
        title: 'הניתוק בוצע בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      loadIntegrations()
    } catch (error) {
      toast({
        title: 'שגיאה בניתוק מהפלטפורמה',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getIntegrationStatus = (platform: string) => {
    return integrations.find(i => i.platform === platform) || {
      isConnected: false,
      lastSync: null,
      connectedAccount: null,
      permissions: [],
      status: 'disconnected'
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>אינטגרציות</Heading>
          <Text color="gray.600">
            ניהול חיבורים לפלטפורמות מדיה חברתית
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {platforms.map((platform) => {
            const status = getIntegrationStatus(platform.name)
            const isConnected = status.isConnected
            const lastSync = status.lastSync ? new Date(status.lastSync) : null

            return (
              <Card key={platform.name}>
                <CardHeader>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={platform.icon} color={platform.color} boxSize={6} />
                      <Heading size="md">{platform.name}</Heading>
                    </HStack>
                    <Badge
                      colorScheme={
                        isConnected
                          ? 'green'
                          : status.status === 'expired'
                          ? 'yellow'
                          : status.status === 'revoked'
                          ? 'red'
                          : 'gray'
                      }
                    >
                      {isConnected
                        ? 'מחובר'
                        : status.status === 'expired'
                        ? 'פג תוקף'
                        : status.status === 'revoked'
                        ? 'בוטל'
                        : 'לא מחובר'}
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {isConnected && (
                      <>
                        <Box>
                          <Text fontSize="sm" color="gray.500">
                            חשבון מחובר
                          </Text>
                          <Text fontWeight="medium">{status.connectedAccount}</Text>
                        </Box>
                        {lastSync && (
                          <Box>
                            <Text fontSize="sm" color="gray.500">
                              סנכרון אחרון
                            </Text>
                            <Text fontWeight="medium">
                              {lastSync.toLocaleString('he-IL')}
                            </Text>
                          </Box>
                        )}
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            הרשאות
                          </Text>
                          <VStack align="start" spacing={1}>
                            {status.permissions.map((permission, index) => (
                              <Text key={index} fontSize="sm">
                                • {permission}
                              </Text>
                            ))}
                          </VStack>
                        </Box>
                      </>
                    )}
                    <Button
                      colorScheme={isConnected ? 'red' : 'blue'}
                      onClick={() =>
                        isConnected
                          ? handleDisconnect(platform.name)
                          : handleConnect(platform.name)
                      }
                    >
                      {isConnected ? 'נתק' : 'התחבר'}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            )
          })}
        </SimpleGrid>
      </VStack>
    </Container>
  )
} 