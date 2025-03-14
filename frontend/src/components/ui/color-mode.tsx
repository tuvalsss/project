"use client"

import { Box, IconButton, Skeleton, useColorMode as useChakraColorMode } from "@chakra-ui/react"
import { forwardRef, useEffect, useState } from "react"
import { LuMoon, LuSun } from "react-icons/lu"

export interface ColorModeProviderProps {
  children?: JSX.Element | JSX.Element[]
  defaultTheme?: "light" | "dark"
}

export function ColorModeProvider({ children, defaultTheme = "light" }: ColorModeProviderProps) {
  const { setColorMode } = useChakraColorMode()

  useEffect(() => {
    setColorMode(defaultTheme)
  }, [defaultTheme, setColorMode])

  return <>{children}</>
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { colorMode, setColorMode, toggleColorMode } = useChakraColorMode()
  return {
    colorMode: colorMode as ColorMode,
    setColorMode,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

type ColorModeButtonProps = {
  variant?: string
  size?: string
  css?: any
  onClick?: () => void
}

export const ColorModeButton = forwardRef((props: ColorModeButtonProps, ref: any) => {
  const { toggleColorMode } = useColorMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Skeleton boxSize="8" />
  }

  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      ref={ref}
      {...props}
      css={{
        _icon: {
          width: "5",
          height: "5",
        },
      }}
    >
      <ColorModeIcon />
    </IconButton>
  )
})

type SpanStyleProps = {
  color?: string
  display?: string
  className?: string
  colorPalette?: string
  colorScheme?: string
}

export const LightMode = forwardRef((props: SpanStyleProps, ref: any) => {
  return (
    <Box
      color="fg"
      display="contents"
      className="chakra-theme light"
      ref={ref}
      {...props}
    />
  )
})

export const DarkMode = forwardRef((props: SpanStyleProps, ref: any) => {
  return (
    <Box
      color="fg"
      display="contents"
      className="chakra-theme dark"
      ref={ref}
      {...props}
    />
  )
})
