import React, { useState, useEffect } from 'react'
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
  HStack,
  Avatar,
  IconButton,
  Divider,
  Switch,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { FaCamera, FaSave, FaLock } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { UserService, UserProfile as UserProfileType } from '../../client'

interface UserProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  notifications: boolean
  twoFactorAuth: boolean
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export const UserProfile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserProfileForm>()

  const {
    register: registerPassword,
    handleSubmit: handlePasswordFormSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm<PasswordForm>()

  const newPassword = watch('newPassword')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const profile = await UserService.getProfile()
      reset(profile)
      setAvatarUrl(profile.avatarUrl || null)
      setIs2FAEnabled(profile.twoFactorAuth)
    } catch (error) {
      toast({
        title: 'שגיאה בטעינת הפרופיל',
        description: error instanceof Error ? error.message : 'אירעה שגיאה בטעינת הפרופיל',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const onSubmit = async (data: UserProfileForm) => {
    setIsLoading(true)
    try {
      await UserService.updateProfile(data)
      toast({
        title: 'הפרופיל עודכן בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה בעדכון הפרופיל',
        description: error instanceof Error ? error.message : 'אירעה שגיאה בעדכון הפרופיל',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const { url } = await UserService.uploadAvatar(file)
      setAvatarUrl(url)
      toast({
        title: 'התמונה עודכנה בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה בהעלאת התמונה',
        description: error instanceof Error ? error.message : 'אירעה שגיאה בהעלאת התמונה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const onSubmitPassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: 'שגיאה',
        description: 'הסיסמאות החדשות אינן תואמות',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      await UserService.updatePassword(data.currentPassword, data.newPassword)
      toast({
        title: 'הסיסמה עודכנה בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      resetPassword()
      onClose()
    } catch (error) {
      toast({
        title: 'שגיאה בעדכון הסיסמה',
        description: error instanceof Error ? error.message : 'אירעה שגיאה בעדכון הסיסמה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handle2FAToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        const { secret, qrCode } = await UserService.enableTwoFactorAuth()
        setSecret(secret)
        setQrCode(qrCode)
        toast({
          title: 'הפעל אימות דו-שלבי',
          description: 'אנא סרוק את קוד ה-QR עם אפליקציית האימות שלך',
          status: 'info',
          duration: 5000,
          isClosable: true,
        })
      } else {
        await UserService.disableTwoFactorAuth()
        setIs2FAEnabled(false)
        toast({
          title: 'אימות דו-שלבי בוטל',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleVerify2FA = async () => {
    try {
      await UserService.verifyTwoFactorAuth(verificationCode)
      setIs2FAEnabled(true)
      setQrCode(null)
      setSecret(null)
      toast({
        title: 'אימות דו-שלבי הופעל בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: error instanceof Error ? error.message : 'אירעה שגיאה',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <Card>
        <CardHeader>
          <Heading size="lg">פרופיל משתמש</Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              <HStack spacing={4} justify="center">
                <Box position="relative">
                  <Avatar
                    size="xl"
                    src={avatarUrl || undefined}
                    name="User Avatar"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload">
                    <IconButton
                      aria-label="Change avatar"
                      icon={<FaCamera />}
                      size="sm"
                      position="absolute"
                      bottom={0}
                      right={0}
                      colorScheme="blue"
                      rounded="full"
                      cursor="pointer"
                    />
                  </label>
                </Box>
              </HStack>

              <Divider />

              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>שם פרטי</FormLabel>
                <Input
                  {...register('firstName', { required: 'שדה חובה' })}
                />
                <FormErrorMessage>
                  {errors.firstName && errors.firstName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>שם משפחה</FormLabel>
                <Input
                  {...register('lastName', { required: 'שדה חובה' })}
                />
                <FormErrorMessage>
                  {errors.lastName && errors.lastName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>אימייל</FormLabel>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'שדה חובה',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'כתובת אימייל לא תקינה',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>טלפון</FormLabel>
                <Input
                  {...register('phone', {
                    pattern: {
                      value: /^[0-9]{9,10}$/,
                      message: 'מספר טלפון לא תקין',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.phone && errors.phone.message}
                </FormErrorMessage>
              </FormControl>

              <Divider />

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">התראות</FormLabel>
                <Switch {...register('notifications')} />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">אימות דו-שלבי</FormLabel>
                <Switch
                  isChecked={is2FAEnabled}
                  onChange={(e) => handle2FAToggle(e.target.checked)}
                />
              </FormControl>

              {qrCode && (
                <Box textAlign="center">
                  <img src={qrCode} alt="2FA QR Code" style={{ maxWidth: '200px', margin: '0 auto' }} />
                  <Text mt={2} fontSize="sm" color="gray.500">
                    סרוק את הקוד עם אפליקציית האימות שלך
                  </Text>
                  <Input
                    mt={4}
                    placeholder="הכנס את קוד האימות"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <Button
                    mt={2}
                    colorScheme="blue"
                    onClick={handleVerify2FA}
                  >
                    אמת
                  </Button>
                </Box>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                leftIcon={<FaSave />}
                isLoading={isLoading}
              >
                שמור שינויים
              </Button>

              <Button
                type="button"
                variant="outline"
                leftIcon={<FaLock />}
                onClick={onOpen}
              >
                שנה סיסמה
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handlePasswordFormSubmit(onSubmitPassword)}>
            <ModalHeader>שינוי סיסמה</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isInvalid={!!passwordErrors.currentPassword}>
                  <FormLabel>סיסמה נוכחית</FormLabel>
                  <Input
                    type="password"
                    {...registerPassword('currentPassword', { required: 'שדה חובה' })}
                  />
                  <FormErrorMessage>
                    {passwordErrors.currentPassword && passwordErrors.currentPassword.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!passwordErrors.newPassword}>
                  <FormLabel>סיסמה חדשה</FormLabel>
                  <Input
                    type="password"
                    {...registerPassword('newPassword', {
                      required: 'שדה חובה',
                      minLength: {
                        value: 8,
                        message: 'הסיסמה חייבת להכיל לפחות 8 תווים',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {passwordErrors.newPassword && passwordErrors.newPassword.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!passwordErrors.confirmPassword}>
                  <FormLabel>אימות סיסמה חדשה</FormLabel>
                  <Input
                    type="password"
                    {...registerPassword('confirmPassword', {
                      required: 'שדה חובה',
                      validate: (value) =>
                        value === newPassword || 'הסיסמאות אינן תואמות',
                    })}
                  />
                  <FormErrorMessage>
                    {passwordErrors.confirmPassword && passwordErrors.confirmPassword.message}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                ביטול
              </Button>
              <Button colorScheme="blue" type="submit">
                שמור
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
} 