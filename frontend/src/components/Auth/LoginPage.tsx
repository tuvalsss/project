import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { LoginService, AuthService } from '../../client'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await LoginService.login({
        username: email,
        password,
      })
      localStorage.setItem('access_token', response.access_token)
      toast({
        title: 'התחברת בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/dashboard')
    } catch (error) {
      toast({
        title: 'שגיאה בהתחברות',
        description: error instanceof Error ? error.message : 'אירעה שגיאה בהתחברות',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      await AuthService.loginWithOAuth(provider)
    } catch (error) {
      toast({
        title: 'שגיאה בהתחברות',
        description: error instanceof Error ? error.message : 'אירעה שגיאה בהתחברות',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      py={12}
      px={4}
      sm:px={6}
      lg:px={8}
    >
      <Card maxW="md" w="full">
        <CardHeader>
          <Heading size="lg" textAlign="center">
            התחברות למערכת
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6}>
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>אימייל</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="הכנס את האימייל שלך"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>סיסמה</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הכנס את הסיסמה שלך"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isLoading}
                >
                  התחבר
                </Button>
              </VStack>
            </form>

            <HStack width="full">
              <Divider />
              <Text color="gray.500">או</Text>
              <Divider />
            </HStack>

            <VStack spacing={4} width="full">
              <Button
                width="full"
                variant="outline"
                leftIcon={<Icon as={FaGoogle} />}
                onClick={() => handleOAuthLogin('google')}
              >
                התחבר עם Google
              </Button>
              <Button
                width="full"
                variant="outline"
                leftIcon={<Icon as={FaFacebook} />}
                onClick={() => handleOAuthLogin('facebook')}
                colorScheme="facebook"
              >
                התחבר עם Facebook
              </Button>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
} 