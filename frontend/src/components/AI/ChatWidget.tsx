import React from 'react'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Text,
  useDisclosure,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { AiService } from '@/client'
import { getErrorMessage } from '@/utils'
import { FaRobot } from 'react-icons/fa'
import { ApiError } from '@/client/core/ApiError'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatResponse {
  response: string
}

export function ChatWidget() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const toast = useToast()

  const mutation = useMutation<ChatResponse, ApiError, string>({
    mutationFn: async (message: string) => {
      const response = await AiService.chat(message)
      return response as ChatResponse
    },
    onSuccess: (response: ChatResponse) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          text: response.response,
          isUser: false,
          timestamp: new Date(),
        },
      ])
    },
    onError: (error: ApiError) => {
      const errorMessage = getErrorMessage(error)
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        text: input,
        isUser: true,
        timestamp: new Date(),
      },
    ])
    mutation.mutate(input)
    setInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <>
      <Button
        position="fixed"
        bottom={4}
        right={4}
        colorScheme="blue"
        size="lg"
        borderRadius="full"
        boxShadow="lg"
        onClick={onOpen}
      >
        <FaRobot />
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>צ'אט עם העוזר החכם</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch" h="100%">
              <Box flex={1} overflowY="auto" p={4}>
                {messages.map((message: Message) => (
                  <Box
                    key={message.id}
                    bg={message.isUser ? 'blue.50' : 'gray.50'}
                    p={3}
                    borderRadius="lg"
                    mb={2}
                    maxW="80%"
                    ml={message.isUser ? 'auto' : '0'}
                    mr={message.isUser ? '0' : 'auto'}
                  >
                    <Text>{message.text}</Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  </Box>
                ))}
              </Box>

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Box p={4} borderTop="1px" borderColor="gray.200">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="הקלד הודעה..."
                  />
                </Box>
              </form>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              סגור
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
} 