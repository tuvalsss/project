import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Switch,
  VStack,
  HStack,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { FacebookCampaign, InstagramInsight, GoogleAdsCampaign, SocialMediaService } from '../../client'

type Campaign = FacebookCampaign | InstagramInsight | GoogleAdsCampaign

interface CampaignEditorProps {
  campaign: Campaign
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export const CampaignEditor: React.FC<CampaignEditorProps> = ({
  campaign,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState(0)
  const [status, setStatus] = useState<'active' | 'paused' | 'ended'>('active')
  const [targeting, setTargeting] = useState({
    age: { min: 18, max: 65 },
    gender: 'all',
    locations: [] as string[],
    interests: [] as string[],
  })
  const [schedule, setSchedule] = useState({
    startDate: '',
    endDate: '',
    timeRanges: [] as { start: string; end: string }[],
  })
  const toast = useToast()

  useEffect(() => {
    if (campaign) {
      setName('name' in campaign ? campaign.name : '')
      setBudget('budget' in campaign ? campaign.budget : 0)
      setStatus('status' in campaign ? campaign.status : 'active')
      // TODO: Load targeting and schedule data
    }
  }, [campaign])

  const handleSave = async () => {
    try {
      const platform = 'postId' in campaign ? 'instagram' : 
                      'ctr' in campaign ? 'google-ads' : 'facebook'
      
      await SocialMediaService.updateCampaign(platform, campaign.id, {
        name,
        budget,
        status,
        targeting,
        schedule,
      })

      toast({
        title: 'הקמפיין עודכן בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onSave()
      onClose()
    } catch (error) {
      toast({
        title: 'שגיאה בעדכון הקמפיין',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>עריכת קמפיין</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>שם הקמפיין</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הכנס שם לקמפיין"
              />
            </FormControl>

            <FormControl>
              <FormLabel>תקציב יומי</FormLabel>
              <NumberInput value={budget} onChange={(_, value) => setBudget(value)} min={0}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>סטטוס</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="active">פעיל</option>
                <option value="paused">מושהה</option>
                <option value="ended">מסתיים</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>טווח גילאים</FormLabel>
              <HStack>
                <NumberInput value={targeting.age.min} onChange={(_, value) => setTargeting({ ...targeting, age: { ...targeting.age, min: value } })} min={13} max={100}>
                  <NumberInputField placeholder="מינימום" />
                </NumberInput>
                <Text>עד</Text>
                <NumberInput value={targeting.age.max} onChange={(_, value) => setTargeting({ ...targeting, age: { ...targeting.age, max: value } })} min={13} max={100}>
                  <NumberInputField placeholder="מקסימום" />
                </NumberInput>
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>מגדר</FormLabel>
              <Select value={targeting.gender} onChange={(e) => setTargeting({ ...targeting, gender: e.target.value })}>
                <option value="all">הכל</option>
                <option value="male">גברים</option>
                <option value="female">נשים</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>תאריכי פעילות</FormLabel>
              <HStack>
                <Input
                  type="date"
                  value={schedule.startDate}
                  onChange={(e) => setSchedule({ ...schedule, startDate: e.target.value })}
                />
                <Text>עד</Text>
                <Input
                  type="date"
                  value={schedule.endDate}
                  onChange={(e) => setSchedule({ ...schedule, endDate: e.target.value })}
                />
              </HStack>
            </FormControl>

            <HStack justify="flex-end" mt={4}>
              <Button onClick={onClose}>ביטול</Button>
              <Button colorScheme="blue" onClick={handleSave}>
                שמור שינויים
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 