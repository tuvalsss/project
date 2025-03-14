import React, { useState } from 'react'
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
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { AiService } from '@/client'
import { FaRobot } from 'react-icons/fa'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export const ChatWidget: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const toast = useToast()

  const chatMutation = useMutation({
    mutationFn: (message: string) => AiService.chat(message),
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: response.message,
          isUser: false,
          timestamp: new Date(response.timestamp),
        },
      ])
    },
    onError: () => {
      toast({
        title: 'שגיאה בשליחת ההודעה',
        status: 'error',
        duration: 2000,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    chatMutation.mutate(input)
    setInput('')
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
                {messages.map((message) => (
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

              <form onSubmit={handleSubmit}>
                <Box p={4} borderTop="1px" borderColor="gray.200">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="הקלד הודעה..."
                    disabled={chatMutation.isPending}
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