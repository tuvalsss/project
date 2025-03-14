import React from 'react'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { AffiliateService, Referral } from '@/client'

export const ReferralsList: React.FC = () => {
  const toast = useToast()
  const { data: referrals, isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => AffiliateService.getReferralsList(),
  })

  if (isLoading) {
    return <Text>טוען...</Text>
  }

  const getStatusColor = (status: Referral['status']) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'pending':
        return 'yellow'
      case 'inactive':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">רשימת הממליצים</Heading>
      </CardHeader>
      <CardBody>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>שם</Th>
                <Th>אימייל</Th>
                <Th>תאריך הצטרפות</Th>
                <Th>סטטוס</Th>
                <Th>עמלה</Th>
              </Tr>
            </Thead>
            <Tbody>
              {referrals?.map((referral) => (
                <Tr key={referral.id}>
                  <Td>{referral.name}</Td>
                  <Td>{referral.email}</Td>
                  <Td>{new Date(referral.date).toLocaleDateString()}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(referral.status)}>
                      {referral.status === 'active'
                        ? 'פעיל'
                        : referral.status === 'pending'
                        ? 'ממתין'
                        : 'לא פעיל'}
                    </Badge>
                  </Td>
                  <Td>₪{referral.commission}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  )
} 