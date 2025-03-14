import React, { useState, useEffect } from 'react'
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
import { AuthService, CampaignsService, CampaignStats, SocialMediaService, FacebookCampaign, InstagramInsight, GoogleAdsCampaign, CampaignHistoryData } from '../client'
import { CampaignList } from './Campaigns/CampaignList'
import { PerformanceChart } from './Charts/PerformanceChart'

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<CampaignStats | null>(null)
  const [campaigns, setCampaigns] = useState<(FacebookCampaign | InstagramInsight | GoogleAdsCampaign)[]>([])
  const [performanceData, setPerformanceData] = useState<CampaignHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsData, facebookCampaigns, instagramInsights, googleAdsCampaigns] = await Promise.all([
        CampaignsService.getCampaignStats(),
        SocialMediaService.getFacebookCampaigns(),
        SocialMediaService.getInstagramInsights(),
        SocialMediaService.getGoogleAdsCampaigns(),
      ])
      setStats(statsData)
      setCampaigns([...facebookCampaigns, ...instagramInsights, ...googleAdsCampaigns])
      await loadPerformanceData('7d')
    } catch (error) {
      toast({
        title: 'שגיאה בטעינת נתונים',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadPerformanceData = async (timeRange: string) => {
    try {
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
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

      const historyData = await SocialMediaService.getCampaignHistory(
        'facebook',
        campaigns[0]?.id || '',
        startDate.toISOString(),
        endDate.toISOString()
      )
      setPerformanceData(historyData)
    } catch (error) {
      toast({
        title: 'שגיאה בטעינת נתוני ביצועים',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      localStorage.removeItem('access_token')
      navigate('/login')
    } catch (error) {
      toast({
        title: 'שגיאה בהתנתקות',
        description: error instanceof Error ? error.message : 'אירעה שגיאה בהתנתקות',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleEditCampaign = (campaign: any) => {
    // TODO: Implement campaign editing
    console.log('Edit campaign:', campaign)
  }

  const handleDeleteCampaign = async (campaign: any) => {
    try {
      const platform = campaign.hasOwnProperty('postId') ? 'instagram' : 
                      campaign.hasOwnProperty('ctr') ? 'google-ads' : 'facebook'
      
      await SocialMediaService.deleteCampaign(platform, campaign.id)
      setCampaigns(campaigns.filter(c => c.id !== campaign.id))
      
      toast({
        title: 'הקמפיין נמחק בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה במחיקת הקמפיין',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleTimeRangeChange = (range: string) => {
    loadPerformanceData(range)
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
              <Button colorScheme="red" onClick={handleLogout}>
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
                    גידול: {stats?.active_growth ? `${stats.active_growth}%` : '0%'}
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
                    גידול: {stats?.conversion_growth ? `${stats.conversion_growth}%` : '0%'}
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
                    גידול: {stats?.roi_growth ? `${stats.roi_growth}%` : '0%'}
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
                    שימוש: {stats?.budget_usage ? `${stats.budget_usage}%` : '0%'}
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
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading size="md">ביצועים אחרונים</Heading>
              </CardHeader>
              <CardBody>
                <PerformanceChart
                  data={performanceData}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              </CardBody>
            </Card>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
} 