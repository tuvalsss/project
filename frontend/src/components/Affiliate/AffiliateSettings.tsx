import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AffiliateService, AffiliateSettings as AffiliateSettingsType } from '@/client'

export const AffiliateSettings: React.FC = () => {
  const toast = useToast()
  const [settings, setSettings] = useState<AffiliateSettingsType>({
    paymentMethod: '',
    paymentDetails: {},
    minimumPayout: 0,
    notifications: {
      email: true,
      push: true,
    },
  })

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['affiliateSettings'],
    queryFn: () => AffiliateService.getAffiliateSettings(),
    onSuccess: (data) => setSettings(data),
  })

  const updateMutation = useMutation({
    mutationFn: (newSettings: AffiliateSettingsType) =>
      AffiliateService.updateAffiliateSettings(newSettings),
    onSuccess: () => {
      toast({
        title: 'הגדרות עודכנו בהצלחה',
        status: 'success',
        duration: 2000,
      })
    },
  })

  if (isLoading) {
    return <Text>טוען...</Text>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(settings)
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">הגדרות שותף</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>אמצעי תשלום</FormLabel>
              <Select
                value={settings.paymentMethod}
                onChange={(e) =>
                  setSettings({ ...settings, paymentMethod: e.target.value })
                }
              >
                <option value="">בחר אמצעי תשלום</option>
                <option value="bank">העברה בנקאית</option>
                <option value="paypal">PayPal</option>
                <option value="crypto">מטבעות דיגיטליים</option>
              </Select>
            </FormControl>

            {settings.paymentMethod === 'bank' && (
              <FormControl>
                <FormLabel>מספר חשבון בנק</FormLabel>
                <Input
                  value={settings.paymentDetails.bankAccount || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paymentDetails: {
                        ...settings.paymentDetails,
                        bankAccount: e.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            )}

            {settings.paymentMethod === 'paypal' && (
              <FormControl>
                <FormLabel>כתובת אימייל PayPal</FormLabel>
                <Input
                  value={settings.paymentDetails.paypalEmail || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paymentDetails: {
                        ...settings.paymentDetails,
                        paypalEmail: e.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            )}

            {settings.paymentMethod === 'crypto' && (
              <FormControl>
                <FormLabel>כתובת ארנק</FormLabel>
                <Input
                  value={settings.paymentDetails.cryptoWallet || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paymentDetails: {
                        ...settings.paymentDetails,
                        cryptoWallet: e.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>תשלום מינימלי</FormLabel>
              <Input
                type="number"
                value={settings.minimumPayout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    minimumPayout: Number(e.target.value),
                  })
                }
              />
            </FormControl>

            <Box>
              <Text fontWeight="bold" mb={2}>
                התראות
              </Text>
              <Stack spacing={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">התראות באימייל</FormLabel>
                  <Switch
                    isChecked={settings.notifications.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          email: e.target.checked,
                        },
                      })
                    }
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">התראות Push</FormLabel>
                  <Switch
                    isChecked={settings.notifications.push}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          push: e.target.checked,
                        },
                      })
                    }
                  />
                </FormControl>
              </Stack>
            </Box>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={updateMutation.isPending}
            >
              שמור הגדרות
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  )
} 