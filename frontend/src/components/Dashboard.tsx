import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { FaChartLine, FaUsers, FaMoneyBillWave, FaRobot, FaHandshake } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/client'
import { SocialMediaService } from '@/services/social-media.service'
import type { FacebookCampaign, InstagramInsight, GoogleAdsCampaign, CampaignStats, CampaignHistoryData } from '@/types/campaigns'
import { CampaignList } from './Campaigns/CampaignList'
import { PerformanceChart } from './Charts/PerformanceChart'
import { ApiError } from '@/client/core/ApiError'

type Campaign = FacebookCampaign | InstagramInsight | GoogleAdsCampaign
type Platform = 'facebook' | 'instagram' | 'google-ads'
type TimeRange = '7d' | '30d' | '90d'

const getPlatformFromCampaign = (campaign: Campaign): Platform => {
  if ('postId' in campaign) return 'instagram'
  if ('ctr' in campaign) return 'google-ads'
  return 'facebook'
}

export const Dashboard = () => {
  const [performanceTimeRange, setPerformanceTimeRange] = useState('7d')
  const toast = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const statsQuery = useQuery(['campaign-stats'], () => SocialMediaService.getCampaignStats(), {
    retry: 3,
  })

  const campaignsQuery = useQuery(['campaigns'], async () => {
    const [facebook, instagram, googleAds] = await Promise.all([
      SocialMediaService.getFacebookCampaigns(),
      SocialMediaService.getInstagramInsights(),
      SocialMediaService.getGoogleAdsCampaigns(),
    ])
    return [...facebook, ...instagram, ...googleAds]
  }, {
    retry: 3,
  })

  const performanceQuery = useQuery(['performance', performanceTimeRange, campaignsQuery.data?.[0]?.id], async () => {
    if (!campaignsQuery.data?.length) return []
    
    const firstCampaign = campaignsQuery.data[0]
    const platform = getPlatformFromCampaign(firstCampaign)
    
    const endDate = new Date()
    const startDate = new Date()
    
    switch (performanceTimeRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
    }

    return SocialMediaService.getCampaignHistory(
      platform,
      firstCampaign.id,
      startDate.toISOString(),
      endDate.toISOString()
    )
  }, {
    retry: 3,
    enabled: Boolean(campaignsQuery.data?.length),
  })

  const stats = statsQuery.data
  const statsError = statsQuery.error as ApiError | null
  const campaigns = campaignsQuery.data || []
  const campaignsError = campaignsQuery.error as ApiError | null
  const performanceData = performanceQuery.data || []
  const performanceError = performanceQuery.error as ApiError | null

  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaign: Campaign) => {
      const platform = getPlatformFromCampaign(campaign)
      await SocialMediaService.deleteCampaign(platform, campaign.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast({
        title: 'הקמפיין נמחק בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (error: ApiError) => {
      toast({
        title: 'שגיאה במחיקת הקמפיין',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      localStorage.removeItem('access_token')
      navigate('/login')
    },
    onError: (error: ApiError) => {
      toast({
        title: 'שגיאה בהתנתקות',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  useEffect(() => {
    if (statsError) {
      toast({
        title: 'שגיאה בטעינת נתוני סטטיסטיקה',
        description: statsError.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    if (campaignsError) {
      toast({
        title: 'שגיאה בטעינת קמפיינים',
        description: campaignsError.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    if (performanceError) {
      toast({
        title: 'שגיאה בטעינת נתוני ביצועים',
        description: performanceError.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [statsError, campaignsError, performanceError, toast])

  const handleEditCampaign = (campaign: Campaign) => {
    const platform = getPlatformFromCampaign(campaign)
    navigate(`/campaigns/${platform}/edit/${campaign.id}`)
  }

  const handleDeleteCampaign = (campaign: Campaign) => {
    deleteCampaignMutation.mutate(campaign)
  }

  const handleTimeRangeChange = (range: TimeRange) => {
    setPerformanceTimeRange(range)
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">לוח בקרה</Heading>
            <HStack>
              <Button
                leftIcon={<FaHandshake />}
                colorScheme="blue"
                onClick={() => navigate('/affiliate')}
              >
                דשבורד שותפים
              </Button>
              <Button
                leftIcon={<FaRobot />}
                colorScheme="blue"
                onClick={() => navigate('/ai')}
              >
                דשבורד AI
              </Button>
              <Button
                leftIcon={<FaUsers />}
                colorScheme="blue"
                onClick={() => navigate('/profile')}
              >
                פרופיל
              </Button>
              <Button
                colorScheme="red"
                onClick={() => logoutMutation.mutate()}
                isLoading={logoutMutation.isPending}
              >
                התנתק
              </Button>
            </HStack>
          </HStack>

          <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>קמפיינים פעילים</StatLabel>
                  <StatNumber>{stats?.active_campaigns || 0}</StatNumber>
                  <StatHelpText>
                    {statsQuery.isLoading ? (
                      'טוען...'
                    ) : (
                      `גידול: ${stats?.active_growth ? `${stats.active_growth}%` : '0%'}`
                    )}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>המרות כוללות</StatLabel>
                  <StatNumber>{stats?.total_conversions || 0}</StatNumber>
                  <StatHelpText>
                    {statsQuery.isLoading ? (
                      'טוען...'
                    ) : (
                      `גידול: ${stats?.conversion_growth ? `${stats.conversion_growth}%` : '0%'}`
                    )}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>ROI ממוצע</StatLabel>
                  <StatNumber>{stats?.average_roi ? `${stats.average_roi}%` : '0%'}</StatNumber>
                  <StatHelpText>
                    {statsQuery.isLoading ? (
                      'טוען...'
                    ) : (
                      `גידול: ${stats?.roi_growth ? `${stats.roi_growth}%` : '0%'}`
                    )}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>תקציב חודשי</StatLabel>
                  <StatNumber>₪{stats?.monthly_budget || 0}</StatNumber>
                  <StatHelpText>
                    {statsQuery.isLoading ? (
                      'טוען...'
                    ) : (
                      `שימוש: ${stats?.budget_usage ? `${stats.budget_usage}%` : '0%'}`
                    )}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </Grid>

          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Card>
              <CardHeader>
                <Heading size="md">קמפיינים פעילים</Heading>
              </CardHeader>
              <CardBody>
                <CampaignList
                  campaigns={campaigns}
                  onEdit={handleEditCampaign}
                  onDelete={handleDeleteCampaign}
                  isLoading={campaignsQuery.isLoading || deleteCampaignMutation.isPending}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="md">ביצועים אחרונים</Heading>
                <HStack spacing={4} mt={4}>
                  <Button
                    size="sm"
                    colorScheme={performanceTimeRange === '7d' ? 'blue' : 'gray'}
                    onClick={() => handleTimeRangeChange('7d')}
                    isDisabled={performanceQuery.isLoading}
                  >
                    7 ימים
                  </Button>
                  <Button
                    size="sm"
                    colorScheme={performanceTimeRange === '30d' ? 'blue' : 'gray'}
                    onClick={() => handleTimeRangeChange('30d')}
                    isDisabled={performanceQuery.isLoading}
                  >
                    30 ימים
                  </Button>
                  <Button
                    size="sm"
                    colorScheme={performanceTimeRange === '90d' ? 'blue' : 'gray'}
                    onClick={() => handleTimeRangeChange('90d')}
                    isDisabled={performanceQuery.isLoading}
                  >
                    90 ימים
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                <PerformanceChart
                  data={performanceData}
                  isLoading={performanceQuery.isLoading || !campaigns.length}
                />
              </CardBody>
            </Card>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
} 