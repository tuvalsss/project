import React from "react"
import { Container, Heading, Box, SimpleGrid, Button, Select } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { FiDownload } from "react-icons/fi"

export const Route = createFileRoute("/_layout/reports")({
  component: Reports,
})

function Reports() {
  return (
    <Container maxW="full">
      <Box pt={12}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} alignItems="center" mb={8}>
          <Heading size="lg">דוחות וניתוחים</Heading>
          <Box textAlign={{ base: "left", md: "right" }}>
            <Button leftIcon={<FiDownload />} colorScheme="blue">
              ייצוא דוח
            </Button>
          </Box>
        </SimpleGrid>

        <Box mb={8}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Select placeholder="בחר סוג דוח">
              <option value="campaigns">דוח קמפיינים</option>
              <option value="affiliates">דוח שותפים</option>
              <option value="revenue">דוח הכנסות</option>
            </Select>
            <Select placeholder="תקופת זמן">
              <option value="week">שבוע אחרון</option>
              <option value="month">חודש אחרון</option>
              <option value="quarter">רבעון אחרון</option>
              <option value="year">שנה אחרונה</option>
            </Select>
            <Select placeholder="פורמט">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </Select>
          </SimpleGrid>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* כאן יבואו קומפוננטות הדוחות */}
        </SimpleGrid>
      </Box>
    </Container>
  )
} 