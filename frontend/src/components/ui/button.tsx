import {
  AbsoluteCenter,
  Button as ChakraButton,
  Box,
  Spinner,
} from "@chakra-ui/react"
import type { ComponentPropsWithRef } from "react"
import * as React from "react"

export interface ButtonProps {
  loading?: boolean
  loadingText?: string | JSX.Element
  children?: string | JSX.Element
  disabled?: boolean
  [key: string]: any
}

const ButtonComponent = (
  props: ButtonProps,
  ref: any
) => {
  const { loading, disabled, loadingText, children, ...rest } = props
  return (
    <ChakraButton disabled={loading || disabled} ref={ref} {...rest}>
      {loading && !loadingText ? (
        <>
          <AbsoluteCenter display="inline-flex">
            <Spinner size="inherit" color="inherit" />
          </AbsoluteCenter>
          <Box opacity={0}>{children}</Box>
        </>
      ) : loading && loadingText ? (
        <>
          <Spinner size="inherit" color="inherit" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </ChakraButton>
  )
}

export const Button = React.forwardRef(ButtonComponent)
