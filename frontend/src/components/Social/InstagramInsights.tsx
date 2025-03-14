import React, { useState } from 'react'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  VStack,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Progress,
} from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SocialMediaService, InstagramInsight, InstagramPost } from '../../client'
import { FaHeart, FaComment, FaShare, FaBookmark, FaUsers, FaChartLine, FaPlus, FaEllipsisV, FaTrash } from 'react-icons/fa'
import { CreateCampaignModal } from './CreateCampaignModal'
import { CampaignHistory } from './CampaignHistory'

export const InstagramInsights: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data: insights, isLoading } = useQuery({
    queryKey: ['instagramInsights'],
    queryFn: () => SocialMediaService.getInstagramInsights(),
  })

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => SocialMediaService.deletePost('instagram', postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagramInsights'] })
      toast({
        title: 'הפוסט נמחק בהצלחה',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (error) => {
      toast({
        title: 'שגיאה במחיקת הפוסט',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  if (isLoading) {
    return <Text>טוען...</Text>
  }

  const handleDelete = (postId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק פוסט זה?')) {
      deletePostMutation.mutate(postId)
    }
  }

  const handleViewHistory = (post: InstagramPost) => {
    setSelectedPost(post)
    setIsHistoryModalOpen(true)
  }

  const totalLikes = insights?.reduce((acc, post) => acc + post.likes, 0) || 0
  const totalComments = insights?.reduce((acc, post) => acc + post.comments, 0) || 0
  const totalShares = insights?.reduce((acc, post) => acc + post.shares, 0) || 0
  const totalSaves = insights?.reduce((acc, post) => acc + post.saves, 0) || 0
  const totalReach = insights?.reduce((acc, post) => acc + post.reach, 0) || 0
  const totalEngagement = insights?.reduce((acc, post) => acc + post.engagement, 0) / (insights?.length || 1) || 0

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">ביצועי אינסטגרם</Heading>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={() => setIsCreateModalOpen(true)}
          >
            פוסט חדש
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack spacing={6}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              סיכום כולל
            </Text>
            <HStack spacing={4} wrap="wrap">
              <Box flex={1} minW="200px">
                <Text color="gray.500">לייקים</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {totalLikes.toLocaleString()}
                </Text>
              </Box>
              <Box flex={1} minW="200px">
                <Text color="gray.500">תגובות</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {totalComments.toLocaleString()}
                </Text>
              </Box>
              <Box flex={1} minW="200px">
                <Text color="gray.500">שיתופים</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {totalShares.toLocaleString()}
                </Text>
              </Box>
              <Box flex={1} minW="200px">
                <Text color="gray.500">שמירות</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {totalSaves.toLocaleString()}
                </Text>
              </Box>
              <Box flex={1} minW="200px">
                <Text color="gray.500">הגעה</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {totalReach.toLocaleString()}
                </Text>
              </Box>
              <Box flex={1} minW="200px">
                <Text color="gray.500">אנגייג'מנט</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {totalEngagement.toFixed(1)}%
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>תאריך</Th>
                  <Th>לייקים</Th>
                  <Th>תגובות</Th>
                  <Th>שיתופים</Th>
                  <Th>שמירות</Th>
                  <Th>הגעה</Th>
                  <Th>אנגייג'מנט</Th>
                  <Th>פעולות</Th>
                </Tr>
              </Thead>
              <Tbody>
                {insights?.map((post: InstagramPost) => (
                  <Tr key={post.id}>
                    <Td>{new Date(post.date).toLocaleDateString('he-IL')}</Td>
                    <Td>{post.likes.toLocaleString()}</Td>
                    <Td>{post.comments.toLocaleString()}</Td>
                    <Td>{post.shares.toLocaleString()}</Td>
                    <Td>{post.saves.toLocaleString()}</Td>
                    <Td>{post.reach.toLocaleString()}</Td>
                    <Td>
                      <Stack spacing={1}>
                        <Progress
                          value={post.engagement}
                          colorScheme="blue"
                          size="sm"
                          borderRadius="full"
                        />
                        <Text fontSize="sm" color="gray.500">
                          {post.engagement}%
                        </Text>
                      </Stack>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FaEllipsisV />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<FaChartLine />}
                            onClick={() => handleViewHistory(post)}
                          >
                            היסטוריה
                          </MenuItem>
                          <MenuItem
                            icon={<FaTrash />}
                            color="red.500"
                            onClick={() => handleDelete(post.id)}
                          >
                            מחק
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Stack>
      </CardBody>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        platform="instagram"
      />

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>היסטוריית פוסט - {selectedPost?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPost && (
              <CampaignHistory
                platform="instagram"
                campaignId={selectedPost.id}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  )
} 