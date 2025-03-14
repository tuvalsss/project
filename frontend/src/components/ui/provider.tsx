"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { theme } from "../../theme"

interface CustomProviderProps {
  children: React.ReactNode
}

export const CustomProvider = ({ children }: CustomProviderProps) => {
  return (
    <ChakraProvider 
      theme={theme}
      toastOptions={{
        defaultOptions: {
          position: "top",
          duration: 5000,
          isClosable: true,
        },
      }}
    >
      {children}
    </ChakraProvider>
  )
}
