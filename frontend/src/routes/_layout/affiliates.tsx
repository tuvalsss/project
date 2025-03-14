import React from "react"
import { Container, Heading, Box, SimpleGrid, Button } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { FiUserPlus } from "react-icons/fi"
import { AffiliateEarnings } from "@/components/Dashboard/AffiliateEarnings"

export const Route = createFileRoute("/_layout/affiliates")({
  component: Affiliates,
})

function Affiliates() {
  return (
    <Container maxW="full">
      <Box pt={12}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} alignItems="center" mb={8}>
          <Heading size="lg">תכנית שותפים</Heading>
          <Box textAlign={{ base: "left", md: "right" }}>
            <Button leftIcon={<FiUserPlus />} colorScheme="blue">
              הוספת שותף חדש
            </Button>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <AffiliateEarnings />
          {/* כאן יבואו קומפוננטות נוספות של תכנית השותפים */}
        </SimpleGrid>
      </Box>
    </Container>
  )
} 