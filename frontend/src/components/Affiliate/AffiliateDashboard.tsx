import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  ListIcon,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react'
import { FaLink, FaUsers, FaMoneyBillWave, FaHistory, FaCog, FaCopy } from 'react-icons/fa'
import { AffiliateService, ReferralData, Referral, Payment, AffiliateSettings, AffiliateEarnings } from '../../client'

export const AffiliateDashboard: React.FC = () => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [settings, setSettings] = useState<AffiliateSettings | null>(null)
  const [earnings, setEarnings] = useState<AffiliateEarnings | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [referralData, referrals, payments, settings, earnings] = await Promise.all([
        AffiliateService.getReferralData(),
        AffiliateService.getReferralsList(),
        AffiliateService.getPaymentsHistory(),
        AffiliateService.getAffiliateSettings(),
        AffiliateService.getEarnings(),
      ])
      setReferralData(referralData)
      setReferrals(referrals)
      setPayments(payments)
      setSettings(settings)
      setEarnings(earnings)
    } catch (error) {
      toast({
        title: 'שגיאה בטעינת נתונים',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralData?.referralLink || '')
      toast({
        title: 'הקישור הועתק בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה בהעתקת הקישור',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleShareLink = async () => {
    try {
      await AffiliateService.shareReferralLink()
      toast({
        title: 'הקישור שותף בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה בשיתוף הקישור',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleUpdateSettings = async (newSettings: Partial<AffiliateSettings>) => {
    if (!settings) return

    try {
      await AffiliateService.updateAffiliateSettings({
        ...settings,
        ...newSettings,
      })
      setSettings({ ...settings, ...newSettings })
      toast({
        title: 'הגדרות עודכנו בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה בעדכון הגדרות',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box p={6}>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>שותפים פעילים</StatLabel>
              <StatNumber>{earnings?.active_affiliates || 0}</StatNumber>
              <StatHelpText>
                ממוצע לשותף: ₪{earnings?.average_per_affiliate || 0}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>הכנסות חודשיות</StatLabel>
              <StatNumber>₪{earnings?.monthly_total || 0}</StatNumber>
              <StatHelpText>סך ההכנסות מהשותפים</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>קישור הפניה</StatLabel>
              <InputGroup>
                <Input value={referralData?.referralLink || ''} isReadOnly />
                <InputRightElement>
                  <Button size="sm" onClick={handleCopyLink}>
                    <FaCopy />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      <Tabs>
        <TabList>
          <Tab>
            <HStack>
              <FaUsers />
              <Text>שותפים</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FaMoneyBillWave />
              <Text>תשלומים</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FaCog />
              <Text>הגדרות</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">רשימת שותפים</Heading>
              </CardHeader>
              <CardBody>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>שם</Th>
                      <Th>אימייל</Th>
                      <Th>תאריך</Th>
                      <Th>סטטוס</Th>
                      <Th>עמלה</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {referrals.map((referral) => (
                      <Tr key={referral.id}>
                        <Td>{referral.name}</Td>
                        <Td>{referral.email}</Td>
                        <Td>{new Date(referral.date).toLocaleDateString()}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              referral.status === 'active'
                                ? 'green'
                                : referral.status === 'pending'
                                ? 'yellow'
                                : 'red'
                            }
                          >
                            {referral.status}
                          </Badge>
                        </Td>
                        <Td>₪{referral.commission}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">היסטוריית תשלומים</Heading>
              </CardHeader>
              <CardBody>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>תאריך</Th>
                      <Th>סכום</Th>
                      <Th>סטטוס</Th>
                      <Th>שיטת תשלום</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {payments.map((payment) => (
                      <Tr key={payment.id}>
                        <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                        <Td>₪{payment.amount}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              payment.status === 'completed'
                                ? 'green'
                                : payment.status === 'pending'
                                ? 'yellow'
                                : 'red'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </Td>
                        <Td>{payment.method}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">הגדרות שותפות</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>שיטת תשלום</FormLabel>
                    <Select
                      value={settings?.paymentMethod}
                      onChange={(e) => handleUpdateSettings({ paymentMethod: e.target.value })}
                    >
                      <option value="bank">העברה בנקאית</option>
                      <option value="paypal">PayPal</option>
                      <option value="crypto">מטבעות דיגיטליים</option>
                    </Select>
                  </FormControl>

                  {settings?.paymentMethod === 'bank' && (
                    <FormControl>
                      <FormLabel>מספר חשבון בנק</FormLabel>
                      <Input
                        value={settings.paymentDetails.bankAccount}
                        onChange={(e) =>
                          handleUpdateSettings({
                            paymentDetails: {
                              ...settings.paymentDetails,
                              bankAccount: e.target.value,
                            },
                          })
                        }
                      />
                    </FormControl>
                  )}

                  {settings?.paymentMethod === 'paypal' && (
                    <FormControl>
                      <FormLabel>אימייל PayPal</FormLabel>
                      <Input
                        value={settings.paymentDetails.paypalEmail}
                        onChange={(e) =>
                          handleUpdateSettings({
                            paymentDetails: {
                              ...settings.paymentDetails,
                              paypalEmail: e.target.value,
                            },
                          })
                        }
                      />
                    </FormControl>
                  )}

                  {settings?.paymentMethod === 'crypto' && (
                    <FormControl>
                      <FormLabel>כתובת ארנק</FormLabel>
                      <Input
                        value={settings.paymentDetails.cryptoWallet}
                        onChange={(e) =>
                          handleUpdateSettings({
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
                    <FormLabel>תשלום מינימום</FormLabel>
                    <Input
                      type="number"
                      value={settings?.minimumPayout}
                      onChange={(e) =>
                        handleUpdateSettings({ minimumPayout: Number(e.target.value) })
                      }
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">התראות באימייל</FormLabel>
                    <Switch
                      isChecked={settings?.notifications.email}
                      onChange={(e) =>
                        handleUpdateSettings({
                          notifications: {
                            ...settings?.notifications,
                            email: e.target.checked,
                          },
                        })
                      }
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">התראות Push</FormLabel>
                    <Switch
                      isChecked={settings?.notifications.push}
                      onChange={(e) =>
                        handleUpdateSettings({
                          notifications: {
                            ...settings?.notifications,
                            push: e.target.checked,
                          },
                        })
                      }
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
} 