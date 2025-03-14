import React from "react"
import { Container, Heading, SimpleGrid, Box, Button, Stack, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { FiPlus } from "react-icons/fi"
import { AdOptimizer } from '@/components/AI/AdOptimizer'

export const Route = createFileRoute("/_layout/campaigns")({
  component: Campaigns,
})

function Campaigns() {
  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading size="lg" mb={2}>
            קמפיינים
          </Heading>
          <Text color="gray.600">
            ניהול וניתוח קמפיינים
          </Text>
        </Box>

        <Stack spacing={6}>
          <AdOptimizer />
        </Stack>
      </Stack>
    </Container>
  )
} 