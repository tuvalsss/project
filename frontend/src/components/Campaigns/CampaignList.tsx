import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  Box,
  Button,
  IconButton,
  useToast,
  useDisclosure,
} from '@chakra-ui/react'
import { FaPlay, FaPause, FaStop, FaEdit, FaTrash } from 'react-icons/fa'
import { SocialMediaService, FacebookCampaign, InstagramInsight, GoogleAdsCampaign } from '../../client'
import { CampaignEditor } from './CampaignEditor'

type Campaign = FacebookCampaign | InstagramInsight | GoogleAdsCampaign

interface CampaignListProps {
  campaigns: Campaign[]
  onEdit: (campaign: Campaign) => void
  onDelete: (campaign: Campaign) => void
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaigns, onEdit, onDelete }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const handleStatusChange = async (campaign: Campaign, newStatus: 'active' | 'paused' | 'ended') => {
    try {
      const platform = 'postId' in campaign ? 'instagram' : 
                      'ctr' in campaign ? 'google-ads' : 'facebook'
      
      await SocialMediaService.updateCampaign(platform, campaign.id, {
        status: newStatus,
      })

      onEdit({ ...campaign, status: newStatus })
    } catch (error) {
      console.error('Error updating campaign status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getBudgetUsage = (campaign: FacebookCampaign | GoogleAdsCampaign) => {
    if (!campaign.budget || !campaign.spent) return 0
    return (campaign.spent / campaign.budget) * 100
  }

  const renderCampaignDetails = (campaign: Campaign) => {
    if ('postId' in campaign) {
      return (
        <Box>
          <Text>פוסט: {campaign.postId}</Text>
          <Text>תגובות: {campaign.engagement}</Text>
          <Text>הגעה: {campaign.reach}</Text>
        </Box>
      )
    } else if ('ctr' in campaign) {
      return (
        <Box>
          <Text>CTR: {(campaign.ctr * 100).toFixed(2)}%</Text>
          <Text>CPC: ₪{campaign.cpc.toFixed(2)}</Text>
          <Text>המרות: {campaign.conversions}</Text>
        </Box>
      )
    } else {
      return (
        <Box>
          <Text>המרות: {campaign.conversions}</Text>
          <Text>הגעה: {campaign.reach}</Text>
        </Box>
      )
    }
  }

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    onOpen()
  }

  const handleSave = () => {
    if (selectedCampaign) {
      onEdit(selectedCampaign)
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      {campaigns.map((campaign) => {
        const campaignName = 'name' in campaign ? campaign.name : 
                           'postId' in campaign ? `קמפיין אינסטגרם ${campaign.postId}` : 
                           `קמפיין ${campaign.id}`
        
        const campaignStatus = 'status' in campaign ? campaign.status : 'active'
        const budgetUsage = 'budget' in campaign && 'spent' in campaign ? getBudgetUsage(campaign as FacebookCampaign | GoogleAdsCampaign) : 0

        return (
          <HStack
            key={campaign.id}
            p={4}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            justify="space-between"
          >
            <VStack align="start" flex={1}>
              <HStack>
                <Text fontWeight="bold">{campaignName}</Text>
                <Badge
                  colorScheme={
                    campaignStatus === 'active'
                      ? 'green'
                      : campaignStatus === 'paused'
                      ? 'yellow'
                      : 'red'
                  }
                >
                  {campaignStatus === 'active'
                    ? 'פעיל'
                    : campaignStatus === 'paused'
                    ? 'מושהה'
                    : 'מסתיים'}
                </Badge>
              </HStack>

              {renderCampaignDetails(campaign)}

              {budgetUsage > 0 && (
                <Box width="100%">
                  <Text fontSize="sm" mb={1}>
                    שימוש בתקציב: {budgetUsage.toFixed(1)}%
                  </Text>
                  <Progress value={budgetUsage} colorScheme="blue" size="sm" />
                </Box>
              )}
            </VStack>

            <HStack>
              <IconButton
                aria-label="ערוך"
                icon={<FaEdit />}
                onClick={() => handleEdit(campaign)}
                colorScheme="blue"
                variant="ghost"
              />
              <IconButton
                aria-label="מחק"
                icon={<FaTrash />}
                onClick={() => onDelete(campaign)}
                colorScheme="red"
                variant="ghost"
              />
              {campaignStatus === 'paused' && (
                <IconButton
                  aria-label="הפעל"
                  icon={<FaPlay />}
                  onClick={() => handleStatusChange(campaign, 'active')}
                  colorScheme="green"
                  variant="ghost"
                />
              )}
              {campaignStatus === 'active' && (
                <IconButton
                  aria-label="השהה"
                  icon={<FaPause />}
                  onClick={() => handleStatusChange(campaign, 'paused')}
                  colorScheme="yellow"
                  variant="ghost"
                />
              )}
              {campaignStatus !== 'ended' && (
                <IconButton
                  aria-label="סיים"
                  icon={<FaStop />}
                  onClick={() => handleStatusChange(campaign, 'ended')}
                  colorScheme="red"
                  variant="ghost"
                />
              )}
            </HStack>
          </HStack>
        )
      })}

      {selectedCampaign && (
        <CampaignEditor
          campaign={selectedCampaign}
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleSave}
        />
      )}
    </VStack>
  )
} 