import React from "react"
import { Container, Heading, Box, SimpleGrid } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { AiInsights } from "@/components/Dashboard/AiInsights"

export const Route = createFileRoute("/_layout/ai-analysis")({
  component: AiAnalysis,
})

function AiAnalysis() {
  return (
    <Container maxW="full">
      <Box pt={12}>
        <Heading size="lg" mb={8}>ניתוח AI מתקדם</Heading>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <AiInsights />
          {/* כאן יבואו קומפוננטות נוספות של ניתוח AI */}
        </SimpleGrid>
      </Box>
    </Container>
  )
} 