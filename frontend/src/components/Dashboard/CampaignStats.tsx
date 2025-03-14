import React from 'react'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react'
import { FaUsers, FaChartLine, FaMoneyBillWave } from 'react-icons/fa'
import { useQuery } from "@tanstack/react-query"
import { CampaignsService } from "@/client"

export const CampaignStats: React.FC = () => {
  const { data: campaignStats, isLoading } = useQuery({
    queryKey: ["campaignStats"],
    queryFn: () => CampaignsService.getCampaignStats(),
  })

  if (isLoading) {
    return <Box>טוען...</Box>
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">סטטיסטיקות קמפיינים</Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat>
            <StatLabel display="flex" alignItems="center">
              <Box as={FaUsers} mr={2} />
              קהל יעד
            </StatLabel>
            <StatNumber>{campaignStats?.active_campaigns || 0}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {campaignStats?.active_growth || 0}% מהחודש שעבר
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel display="flex" alignItems="center">
              <Box as={FaChartLine} mr={2} />
              ביצועים
            </StatLabel>
            <StatNumber>{campaignStats?.total_conversions || 0}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {campaignStats?.conversion_growth || 0}% מהחודש שעבר
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel display="flex" alignItems="center">
              <Box as={FaMoneyBillWave} mr={2} />
              ROI
            </StatLabel>
            <StatNumber>{campaignStats?.average_roi || 0}%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {campaignStats?.roi_growth || 0}% מהחודש שעבר
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </CardBody>
    </Card>
  )
} 