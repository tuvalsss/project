import React from "react"
import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Link as RouterLink } from "@tanstack/react-router"
import { 
  FiHome, 
  FiSettings, 
  FiUsers, 
  FiTrendingUp,
  FiBarChart2,
  FiTarget,
  FiDollarSign,
  FiLink
} from "react-icons/fi"
import type { IconType } from "react-icons/lib"

import type { UserPublic } from "@/client"

const items = [
  { icon: FiHome, title: "דשבורד", path: "/" },
  { icon: FiTarget, title: "קמפיינים", path: "/campaigns" },
  { icon: FiBarChart2, title: "ניתוח AI", path: "/ai-dashboard" },
  { icon: FiDollarSign, title: "תכנית שותפים", path: "/affiliate-dashboard" },
  { icon: FiTrendingUp, title: "דוחות", path: "/reports" },
  { icon: FiLink, title: "אינטגרציות", path: "/integrations" },
  { icon: FiSettings, title: "הגדרות", path: "/settings" },
]

interface SidebarItemsProps {
  onClose?: () => void
}

interface Item {
  icon: IconType
  title: string
  path: string
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  const finalItems = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "ניהול", path: "/admin" }]
    : items

  const listItems = finalItems.map(({ icon, title, path }) => (
    <RouterLink key={title} to={path} onClick={onClose}>
      <Flex
        gap={4}
        px={4}
        py={2}
        _hover={{
          background: "gray.subtle",
        }}
        alignItems="center"
        fontSize="sm"
      >
        <Icon as={icon} alignSelf="center" />
        <Text ml={2}>{title}</Text>
      </Flex>
    </RouterLink>
  ))

  return (
    <>
      <Text fontSize="xs" px={4} py={2} fontWeight="bold">
        תפריט
      </Text>
      <Box>{listItems}</Box>
    </>
  )
}

export default SidebarItems
