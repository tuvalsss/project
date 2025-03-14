import React, { useState } from 'react'
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
  Progress,
  Stack,
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
import { SocialMediaService, FacebookCampaign } from '../../client'
import { FaPlus, FaEllipsisV, FaPlay, FaPause, FaTrash, FaChartLine } from 'react-icons/fa'
import { CreateCampaignModal } from './CreateCampaignModal'
import { CampaignHistory } from './CampaignHistory'

export const FacebookCampaigns: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<FacebookCampaign | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['facebookCampaigns'],
    queryFn: () => SocialMediaService.getFacebookCampaigns(),
  })

  const updateCampaignMutation = useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: any }) =>
      SocialMediaService.updateCampaign('facebook', campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebookCampaigns'] })
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
    mutationFn: (campaignId: string) => SocialMediaService.deleteCampaign('facebook', campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebookCampaigns'] })
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

  const handleViewHistory = (campaign: FacebookCampaign) => {
    setSelectedCampaign(campaign)
    setIsHistoryModalOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">קמפיינים בפייסבוק</Heading>
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
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>שם קמפיין</Th>
                <Th>סטטוס</Th>
                <Th>תקציב</Th>
                <Th>הוצאות</Th>
                <Th>הגעה</Th>
                <Th>המרות</Th>
                <Th>ביצועים</Th>
                <Th>פעולות</Th>
              </Tr>
            </Thead>
            <Tbody>
              {campaigns?.map((campaign: FacebookCampaign) => (
                <Tr key={campaign.id}>
                  <Td>{campaign.name}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </Td>
                  <Td>₪{campaign.budget}</Td>
                  <Td>₪{campaign.spent}</Td>
                  <Td>{campaign.reach.toLocaleString()}</Td>
                  <Td>{campaign.conversions}</Td>
                  <Td>
                    <Stack spacing={1}>
                      <Progress
                        value={(campaign.engagement / 100) * 100}
                        colorScheme="blue"
                        size="sm"
                        borderRadius="full"
                      />
                      <Text fontSize="sm" color="gray.500">
                        {campaign.engagement}%
                      </Text>
                    </Stack>
                  </Td>
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
      </CardBody>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        platform="facebook"
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
                platform="facebook"
                campaignId={selectedCampaign.id}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  )
} 