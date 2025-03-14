import React, { useState } from 'react'
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
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  VStack,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SocialMediaService, GoogleAdsCampaign } from '../../client'
import { FaChartLine, FaMousePointer, FaUsers, FaMoneyBillWave, FaPlus, FaEllipsisV, FaPlay, FaPause, FaTrash } from 'react-icons/fa'
import { CreateCampaignModal } from './CreateCampaignModal'
import { CampaignHistory } from './CampaignHistory'

export const GoogleAdsStats: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<GoogleAdsCampaign | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['googleAdsCampaigns'],
    queryFn: () => SocialMediaService.getGoogleAdsStats(),
  })

  const updateCampaignMutation = useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: any }) =>
      SocialMediaService.updateCampaign('google-ads', campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['googleAdsCampaigns'] })
      toast({
        title: 'הקמפיין עודכן בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (error) => {
      toast({
        title: 'שגיאה בעדכון הקמפיין',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const deleteCampaignMutation = useMutation({
    mutationFn: (campaignId: string) => SocialMediaService.deleteCampaign('google-ads', campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['googleAdsCampaigns'] })
      toast({
        title: 'הקמפיין נמחק בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (error) => {
      toast({
        title: 'שגיאה במחיקת הקמפיין',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  if (isLoading) {
    return <Text>טוען...</Text>
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green'
      case 'paused':
        return 'yellow'
      case 'ended':
        return 'red'
      default:
        return 'gray'
    }
  }

  const handleStatusChange = (campaignId: string, newStatus: string) => {
    updateCampaignMutation.mutate({
      campaignId,
      data: { status: newStatus },
    })
  }

  const handleDelete = (campaignId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק קמפיין זה?')) {
      deleteCampaignMutation.mutate(campaignId)
    }
  }

  const handleViewHistory = (campaign: GoogleAdsCampaign) => {
    setSelectedCampaign(campaign)
    setIsHistoryModalOpen(true)
  }

  const totalSpent = campaigns?.reduce((acc, campaign) => acc + campaign.spent, 0) || 0
  const totalClicks = campaigns?.reduce((acc, campaign) => acc + campaign.clicks, 0) || 0
  const totalImpressions = campaigns?.reduce((acc, campaign) => acc + campaign.impressions, 0) || 0
  const totalConversions = campaigns?.reduce((acc, campaign) => acc + campaign.conversions, 0) || 0

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">סטטיסטיקות Google Ads</Heading>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={() => setIsCreateModalOpen(true)}
          >
            קמפיין חדש
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Stat>
              <StatLabel display="flex" alignItems="center">
                <Box as={FaMoneyBillWave} mr={2} />
                סך הכל הוצאות
              </StatLabel>
              <StatNumber>₪{totalSpent.toLocaleString()}</StatNumber>
              <StatHelpText>מכל הקמפיינים</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel display="flex" alignItems="center">
                <Box as={FaMousePointer} mr={2} />
                סך הכל לחיצות
              </StatLabel>
              <StatNumber>{totalClicks.toLocaleString()}</StatNumber>
              <StatHelpText>מכל הקמפיינים</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel display="flex" alignItems="center">
                <Box as={FaUsers} mr={2} />
                סך הכל חשיפות
              </StatLabel>
              <StatNumber>{totalImpressions.toLocaleString()}</StatNumber>
              <StatHelpText>מכל הקמפיינים</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel display="flex" alignItems="center">
                <Box as={FaChartLine} mr={2} />
                סך הכל המרות
              </StatLabel>
              <StatNumber>{totalConversions.toLocaleString()}</StatNumber>
              <StatHelpText>מכל הקמפיינים</StatHelpText>
            </Stat>
          </SimpleGrid>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>שם קמפיין</Th>
                  <Th>סטטוס</Th>
                  <Th>תקציב</Th>
                  <Th>הוצאות</Th>
                  <Th>לחיצות</Th>
                  <Th>חשיפות</Th>
                  <Th>המרות</Th>
                  <Th>CTR</Th>
                  <Th>CPC</Th>
                  <Th>פעולות</Th>
                </Tr>
              </Thead>
              <Tbody>
                {campaigns?.map((campaign) => (
                  <Tr key={campaign.id}>
                    <Td>{campaign.name}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </Td>
                    <Td>₪{campaign.budget.toLocaleString()}</Td>
                    <Td>₪{campaign.spent.toLocaleString()}</Td>
                    <Td>{campaign.clicks.toLocaleString()}</Td>
                    <Td>{campaign.impressions.toLocaleString()}</Td>
                    <Td>{campaign.conversions.toLocaleString()}</Td>
                    <Td>{(campaign.ctr * 100).toFixed(2)}%</Td>
                    <Td>₪{campaign.cpc.toFixed(2)}</Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FaEllipsisV />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<FaChartLine />}
                            onClick={() => handleViewHistory(campaign)}
                          >
                            היסטוריה
                          </MenuItem>
                          {campaign.status === 'active' ? (
                            <MenuItem
                              icon={<FaPause />}
                              onClick={() => handleStatusChange(campaign.id, 'paused')}
                            >
                              עצור
                            </MenuItem>
                          ) : (
                            <MenuItem
                              icon={<FaPlay />}
                              onClick={() => handleStatusChange(campaign.id, 'active')}
                            >
                              הפעל
                            </MenuItem>
                          )}
                          <MenuItem
                            icon={<FaTrash />}
                            color="red.500"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            מחק
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </CardBody>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        platform="google-ads"
      />

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>היסטוריית קמפיין - {selectedCampaign?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCampaign && (
              <CampaignHistory
                platform="google-ads"
                campaignId={selectedCampaign.id}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  )
} 