import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  VStack,
  HStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
} from '@chakra-ui/react'
import { UsersService, UserPublic, UserRole } from '../../client'

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserPublic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await UsersService.getAllUsers()
      setUsers(data)
    } catch (error) {
      toast({
        title: 'שגיאה בטעינת משתמשים',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await UsersService.updateUserRole(userId, newRole)
      toast({
        title: 'תפקיד המשתמש עודכן בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      loadUsers()
    } catch (error) {
      toast({
        title: 'שגיאה בעדכון תפקיד המשתמש',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN_HIGH:
        return 'red'
      case UserRole.ADMIN_MEDIUM:
        return 'orange'
      case UserRole.ADMIN_LOW:
        return 'yellow'
      case UserRole.VIP:
        return 'purple'
      case UserRole.PRO:
        return 'blue'
      case UserRole.ADVANCED:
        return 'green'
      case UserRole.STARTER:
        return 'teal'
      case UserRole.REGISTERED:
        return 'gray'
      default:
        return 'gray'
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>לוח בקרת מנהלים</Heading>
          <Text color="gray.600">
            ניהול משתמשים, הרשאות ותפקידים
          </Text>
        </Box>

        <Tabs>
          <TabList>
            <Tab>משתמשים</Tab>
            <Tab>הרשאות</Tab>
            <Tab>הגדרות מערכת</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Card>
                <CardHeader>
                  <Heading size="md">רשימת משתמשים</Heading>
                </CardHeader>
                <CardBody>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>שם</Th>
                        <Th>אימייל</Th>
                        <Th>תפקיד</Th>
                        <Th>פעולות</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user) => (
                        <Tr key={user.id}>
                          <Td>{user.full_name || 'לא הוגדר'}</Td>
                          <Td>{user.email}</Td>
                          <Td>
                            <Badge colorScheme={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() => handleUpdateUserRole(user.id, UserRole.ADMIN_LOW)}
                              >
                                עדכן תפקיד
                              </Button>
                            </HStack>
                          </Td>
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
                  <Heading size="md">הרשאות מערכת</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>תפקיד</Th>
                          <Th>הרשאות</Th>
                          <Th>פעולות</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {Object.entries(RolePermissions).map(([role, permissions]) => (
                          <Tr key={role}>
                            <Td>
                              <Badge colorScheme={getRoleColor(role as UserRole)}>
                                {role}
                              </Badge>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={1}>
                                {Object.entries(permissions)
                                  .filter(([_, value]) => value)
                                  .map(([permission]) => (
                                    <Text key={permission} fontSize="sm">
                                      • {permission}
                                    </Text>
                                  ))}
                              </VStack>
                            </Td>
                            <Td>
                              <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() => {
                                  // TODO: Add permission editing modal
                                  toast({
                                    title: 'עריכת הרשאות',
                                    description: 'פונקציונליות זו תהיה זמינה בקרוב',
                                    status: 'info',
                                    duration: 3000,
                                    isClosable: true,
                                  })
                                }}
                              >
                                ערוך הרשאות
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel>
              <Card>
                <CardHeader>
                  <Heading size="md">הגדרות מערכת</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontWeight="medium" mb={2}>הגדרות כלליות</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">מצב תחזוקה</Text>
                          <Switch defaultChecked>פעיל</Switch>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">התראות מערכת</Text>
                          <Switch defaultChecked>פעיל</Switch>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">גיבוי אוטומטי</Text>
                          <Switch defaultChecked>פעיל</Switch>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">ניטור ביצועים</Text>
                          <Switch defaultChecked>פעיל</Switch>
                        </Box>
                      </SimpleGrid>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" mb={2}>הגדרות אבטחה</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.500">אימות דו-שלבי</Text>
                          <Switch defaultChecked>חובה</Switch>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">הגבלת ניסיונות התחברות</Text>
                          <Switch defaultChecked>פעיל</Switch>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">תיעוד פעולות</Text>
                          <Switch defaultChecked>פעיל</Switch>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500">הצפנת נתונים</Text>
                          <Switch defaultChecked>פעיל</Switch>
                        </Box>
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  )
} 