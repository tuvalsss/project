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
import { AffiliateService, Payment } from '@/client'

export const PaymentsHistory: React.FC = () => {
  const toast = useToast()
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => AffiliateService.getPaymentsHistory(),
  })

  if (isLoading) {
    return <Text>טוען...</Text>
  }

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'pending':
        return 'yellow'
      case 'failed':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'הושלם'
      case 'pending':
        return 'ממתין'
      case 'failed':
        return 'נכשל'
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">היסטוריית תשלומים</Heading>
      </CardHeader>
      <CardBody>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>תאריך</Th>
                <Th>סכום</Th>
                <Th>אמצעי תשלום</Th>
                <Th>סטטוס</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments?.map((payment) => (
                <Tr key={payment.id}>
                  <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                  <Td>₪{payment.amount}</Td>
                  <Td>{payment.method}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(payment.status)}>
                      {getStatusText(payment.status)}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  )
} 