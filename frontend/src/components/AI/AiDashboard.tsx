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
  Select,
  Input,
  Textarea,
  Progress,
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
} from '@chakra-ui/react'
import { FaChartLine, FaClock, FaHashtag, FaUsers, FaLightbulb } from 'react-icons/fa'
import { AiService, AdOptimizationData } from '../../client'

export const AiDashboard: React.FC = () => {
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'google-ads'>('facebook')
  const [optimizationData, setOptimizationData] = useState<AdOptimizationData | null>(null)
  const [content, setContent] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [competitors, setCompetitors] = useState<string[]>([])
  const [newCompetitor, setNewCompetitor] = useState('')
  const [suggestions, setSuggestions] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadOptimizationData()
  }, [platform])

  const loadOptimizationData = async () => {
    try {
      const data = await AiService.getAdOptimization()
      setOptimizationData(data)
    } catch (error) {
      toast({
        title: 'שגיאה בטעינת נתוני אופטימיזציה',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleAnalyzeContent = async () => {
    if (!content) {
      toast({
        title: 'שגיאה',
        description: 'נא להזין תוכן לניתוח',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await AiService.analyzeContent(content)
      setAnalysis(result)
      toast({
        title: 'התוכן נותח בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה בניתוח התוכן',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCompetitor = () => {
    if (newCompetitor && !competitors.includes(newCompetitor)) {
      setCompetitors([...competitors, newCompetitor])
      setNewCompetitor('')
    }
  }

  const handleAnalyzeCompetitors = async () => {
    if (competitors.length === 0) {
      toast({
        title: 'שגיאה',
        description: 'נא להוסיף מתחרים לניתוח',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await AiService.getCompetitorInsights(platform, competitors)
      setAnalysis(result)
      toast({
        title: 'ניתוח המתחרים הושלם בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה בניתוח המתחרים',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSuggestions = async () => {
    if (!topic) {
      toast({
        title: 'שגיאה',
        description: 'נא להזין נושא להמלצות',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await AiService.generateContentSuggestions(platform, topic)
      setSuggestions(result)
      toast({
        title: 'המלצות תוכן נוצרו בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה ביצירת המלצות',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box p={6}>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>ציון אופטימיזציה נוכחי</StatLabel>
              <StatNumber>
                {optimizationData?.currentScore ? `${optimizationData.currentScore}%` : '0%'}
              </StatNumber>
              <StatHelpText>
                פוטנציאל לשיפור: {optimizationData?.potentialImprovement}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>זמני פרסום מומלצים</StatLabel>
              <StatNumber>{optimizationData?.suggestedTimes.length || 0}</StatNumber>
              <StatHelpText>זמנים אופטימליים לפרסום</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>המלצות פעולה</StatLabel>
              <StatNumber>{optimizationData?.recommendations.length || 0}</StatNumber>
              <StatHelpText>המלצות לשיפור ביצועים</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      <Tabs>
        <TabList>
          <Tab>
            <HStack>
              <FaChartLine />
              <Text>אופטימיזציה</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FaClock />
              <Text>זמני פרסום</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FaHashtag />
              <Text>ניתוח תוכן</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FaUsers />
              <Text>ניתוח מתחרים</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FaLightbulb />
              <Text>המלצות תוכן</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">אופטימיזציית קמפיינים</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Select value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="google-ads">Google Ads</option>
                  </Select>

                  <Progress value={optimizationData?.currentScore || 0} colorScheme="blue" />

                  <List spacing={3}>
                    {optimizationData?.recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListIcon as={FaLightbulb} color="blue.500" />
                        {rec}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">זמני פרסום אופטימליים</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Select value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="google-ads">Google Ads</option>
                  </Select>

                  <List spacing={3}>
                    {optimizationData?.suggestedTimes.map((time, index) => (
                      <ListItem key={index}>
                        <ListIcon as={FaClock} color="green.500" />
                        {time}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">ניתוח תוכן</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="הזן את התוכן לניתוח..."
                    size="lg"
                    rows={6}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={handleAnalyzeContent}
                    isLoading={isLoading}
                  >
                    ניתוח תוכן
                  </Button>

                  {analysis && (
                    <Box>
                      <Heading size="sm" mb={4}>תוצאות הניתוח</Heading>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <Card>
                          <CardBody>
                            <Stat>
                              <StatLabel>סנטימנט</StatLabel>
                              <StatNumber>{analysis.sentiment}</StatNumber>
                            </Stat>
                          </CardBody>
                        </Card>
                        <Card>
                          <CardBody>
                            <Stat>
                              <StatLabel>מילות מפתח</StatLabel>
                              <StatNumber>{analysis.keywords.length}</StatNumber>
                            </Stat>
                          </CardBody>
                        </Card>
                        <Card>
                          <CardBody>
                            <Stat>
                              <StatLabel>שטאגים</StatLabel>
                              <StatNumber>{analysis.hashtags.length}</StatNumber>
                            </Stat>
                          </CardBody>
                        </Card>
                      </Grid>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">ניתוח מתחרים</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <Input
                      value={newCompetitor}
                      onChange={(e) => setNewCompetitor(e.target.value)}
                      placeholder="הוסף מתחרה..."
                    />
                    <Button onClick={handleAddCompetitor}>הוסף</Button>
                  </HStack>

                  <List spacing={3}>
                    {competitors.map((comp, index) => (
                      <ListItem key={index}>
                        <ListIcon as={FaUsers} color="purple.500" />
                        {comp}
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    colorScheme="blue"
                    onClick={handleAnalyzeCompetitors}
                    isLoading={isLoading}
                  >
                    ניתוח מתחרים
                  </Button>

                  {analysis?.marketShare && (
                    <Box>
                      <Heading size="sm" mb={4}>תוצאות הניתוח</Heading>
                      <Stat>
                        <StatLabel>חלק בשוק</StatLabel>
                        <StatNumber>{analysis.marketShare}%</StatNumber>
                      </Stat>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">המלצות תוכן</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="הזן נושא להמלצות..."
                  />
                  <Button
                    colorScheme="blue"
                    onClick={handleGenerateSuggestions}
                    isLoading={isLoading}
                  >
                    צור המלצות
                  </Button>

                  {suggestions && (
                    <Box>
                      <Heading size="sm" mb={4}>המלצות תוכן</Heading>
                      <VStack spacing={4} align="stretch">
                        <Box>
                          <Text fontWeight="bold">כותרות מומלצות:</Text>
                          <List spacing={2}>
                            {suggestions.headlines.map((headline, index) => (
                              <ListItem key={index}>{headline}</ListItem>
                            ))}
                          </List>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">שטאגים מומלצים:</Text>
                          <HStack wrap="wrap" spacing={2}>
                            {suggestions.hashtags.map((tag, index) => (
                              <Badge key={index} colorScheme="blue">
                                #{tag}
                              </Badge>
                            ))}
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
} 