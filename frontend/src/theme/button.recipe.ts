import { createStylesContext } from "@chakra-ui/react"

export const [ButtonStylesProvider, useButtonStyles] = createStylesContext("Button")

export const buttonRecipe = {
  base: {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    colorPalette: "teal",
  },
  variants: {
    variant: {
      ghost: {
        bg: "transparent",
        _hover: {
          bg: "gray.100",
        },
      },
    },
  },
}
