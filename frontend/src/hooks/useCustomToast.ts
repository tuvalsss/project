"use client"

import { useToast as useChakraToast } from "@chakra-ui/react"

const useCustomToast = () => {
  const toast = useChakraToast()

  const showSuccessToast = (description: string) => {
    toast({
      title: "Success!",
      description,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const showErrorToast = (description: string) => {
    toast({
      title: "Something went wrong!",
      description,
      status: "error",
      duration: 5000,
      isClosable: true,
    })
  }

  return { showSuccessToast, showErrorToast }
}

export default useCustomToast
