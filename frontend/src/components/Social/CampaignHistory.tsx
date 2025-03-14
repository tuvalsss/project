import React, { useState } from 'react'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { SocialMediaService, CampaignHistoryData } from '../../client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface CampaignHistoryProps {
  platform: 'facebook' | 'instagram' | 'google-ads'
  campaignId: string
}

export const CampaignHistory: React.FC<CampaignHistoryProps> = ({ platform, campaignId }) => {
  const [dateRange, setDateRange] = useState('7d')
  const toast = useToast()

  const { data: history, isLoading } = useQuery({
    queryKey: ['campaignHistory', platform, campaignId, dateRange],
    queryFn: () => {
      const endDate = new Date().toISOString()
      const startDate = new Date()
      switch (dateRange) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(startDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(startDate.getDate() - 90)
          break
        default:
          startDate.setDate(startDate.getDate() - 7)
      }
      return SocialMediaService.getCampaignHistory(
        platform,
        campaignId,
        startDate.toISOString(),
        endDate
      )
    },
  })

  React.useEffect(() => {
    if (history === undefined) {
      toast({
        title: 'שגיאה בטעינת היסטוריית הקמפיין',
        description: 'לא ניתן לטעון את היסטוריית הקמפיין',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [history, toast])

  if (isLoading) {
    return <Text>טוען...</Text>
  }

  const chartData = {
    labels: history?.map((item) => new Date(item.date).toLocaleDateString('he-IL')) || [],
    datasets: [
      {
        label: 'הצגות',
        data: history?.map((item) => item.impressions) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'לחיצות',
        data: history?.map((item) => item.clicks) || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'המרות',
        data: history?.map((item) => item.conversions) || [],
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'ביצועי קמפיין לאורך זמן',
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">היסטוריית קמפיין</Heading>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            width="200px"
          >
            <option value="7d">7 ימים אחרונים</option>
            <option value="30d">30 ימים אחרונים</option>
            <option value="90d">90 ימים אחרונים</option>
          </Select>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box height="400px">
            <Line options={chartOptions} data={chartData} />
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>תאריך</Th>
                  <Th>הצגות</Th>
                  <Th>לחיצות</Th>
                  <Th>המרות</Th>
                  <Th>הוצאות</Th>
                  <Th>CTR</Th>
                  <Th>CPC</Th>
                </Tr>
              </Thead>
              <Tbody>
                {history?.map((item: CampaignHistoryData) => (
                  <Tr key={item.date}>
                    <Td>{new Date(item.date).toLocaleDateString('he-IL')}</Td>
                    <Td>{item.impressions.toLocaleString()}</Td>
                    <Td>{item.clicks.toLocaleString()}</Td>
                    <Td>{item.conversions.toLocaleString()}</Td>
                    <Td>₪{item.spent.toLocaleString()}</Td>
                    <Td>{(item.ctr * 100).toFixed(2)}%</Td>
                    <Td>₪{item.cpc.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
} 