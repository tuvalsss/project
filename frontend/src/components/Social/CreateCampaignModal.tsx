import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SocialMediaService } from '../../client'

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  platform: 'facebook' | 'instagram' | 'google-ads'
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  platform,
}) => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = React.useState({
    name: '',
    budget: 0,
    startDate: '',
    endDate: '',
    adContent: '',
    callToAction: '',
  })

  const createCampaignMutation = useMutation({
    mutationFn: () => SocialMediaService.createCampaign(platform, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${platform}Campaigns`] })
      toast({
        title: 'הקמפיין נוצר בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
    },
    onError: (error) => {
      toast({
        title: 'שגיאה ביצירת הקמפיין',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createCampaignMutation.mutate()
  }

  const getPlatformTitle = () => {
    switch (platform) {
      case 'facebook':
        return 'קמפיין Facebook'
      case 'instagram':
        return 'פוסט Instagram'
      case 'google-ads':
        return 'קמפיין Google Ads'
      default:
        return 'קמפיין'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{getPlatformTitle()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>שם</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="הכנס שם"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>תקציב</FormLabel>
                <NumberInput
                  value={formData.budget}
                  onChange={(value) => setFormData({ ...formData, budget: Number(value) })}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>תאריך התחלה</FormLabel>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>תאריך סיום</FormLabel>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>תוכן</FormLabel>
                <Input
                  value={formData.adContent}
                  onChange={(e) => setFormData({ ...formData, adContent: e.target.value })}
                  placeholder="הכנס תוכן"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>קריאה לפעולה</FormLabel>
                <Select
                  value={formData.callToAction}
                  onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
                >
                  <option value="">בחר קריאה לפעולה</option>
                  <option value="buy">קנה עכשיו</option>
                  <option value="learn">למד עוד</option>
                  <option value="signup">הירשם</option>
                  <option value="contact">צור קשר</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              ביטול
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={createCampaignMutation.isPending}
            >
              צור
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
} 