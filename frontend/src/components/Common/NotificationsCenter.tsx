import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  Icon,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  HStack,
  Divider
} from '@chakra-ui/react';
import { FaBell, FaMoneyBill, FaChartLine, FaCog } from 'react-icons/fa';
import useWebSocket from 'react-use-websocket';
import { useAuth } from '../../hooks/useAuth';

interface Notification {
  id: string;
  type: 'campaign_performance' | 'payment' | 'system' | 'commission';
  title: string;
  message: string;
  metadata: any;
  created_at: string;
  read: boolean;
}

const NotificationIcon = {
  campaign_performance: FaChartLine,
  payment: FaMoneyBill,
  system: FaCog,
  commission: FaMoneyBill,
};

const NotificationBadgeColor = {
  campaign_performance: 'blue',
  payment: 'green',
  system: 'purple',
  commission: 'orange',
};

export const NotificationsCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const toast = useToast();

  const { lastMessage } = useWebSocket(
    `ws://your-domain.com/ws/notifications/${user?.id}`,
    {
      onOpen: () => console.log('WebSocket Connected'),
      onError: () => console.log('WebSocket Error'),
      onClose: () => console.log('WebSocket Closed'),
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (lastMessage) {
      const notification = JSON.parse(lastMessage.data);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // הצגת התראה קופצת
      toast({
        title: notification.title,
        description: notification.message,
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [lastMessage, toast]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <>
      <Box position="relative" cursor="pointer" onClick={() => setIsOpen(true)}>
        <Icon as={FaBell} boxSize={6} />
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-2"
            right="-2"
            colorScheme="red"
            borderRadius="full"
            minW="1.5rem"
            textAlign="center"
          >
            {unreadCount}
          </Badge>
        )}
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => setIsOpen(false)}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack justify="space-between">
              <Text>התראות</Text>
              {unreadCount > 0 && (
                <Button size="sm" onClick={handleMarkAllAsRead}>
                  סמן הכל כנקרא
                </Button>
              )}
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  bg={notification.read ? 'transparent' : 'gray.50'}
                  _dark={{
                    bg: notification.read ? 'transparent' : 'gray.700'
                  }}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  cursor={notification.read ? 'default' : 'pointer'}
                >
                  <HStack spacing={4}>
                    <Icon
                      as={NotificationIcon[notification.type]}
                      boxSize={5}
                      color={`${NotificationBadgeColor[notification.type]}.500`}
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack justify="space-between" width="100%">
                        <Text fontWeight="bold">{notification.title}</Text>
                        <Badge colorScheme={NotificationBadgeColor[notification.type]}>
                          {notification.type === 'campaign_performance' && 'ביצועי קמפיין'}
                          {notification.type === 'payment' && 'תשלום'}
                          {notification.type === 'system' && 'מערכת'}
                          {notification.type === 'commission' && 'עמלה'}
                        </Badge>
                      </HStack>
                      <Text color="gray.600" _dark={{ color: 'gray.300' }}>
                        {notification.message}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(notification.created_at).toLocaleString('he-IL')}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
              
              {notifications.length === 0 && (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">אין התראות חדשות</Text>
                </Box>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}; 