import { InputGroup as ChakraInputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react"
import * as React from "react"

interface InputGroupProps {
  startElementProps?: any
  endElementProps?: any
  startElement?: any
  endElement?: any
  children: any
  startOffset?: string
  endOffset?: string
  [key: string]: any
}

export const InputGroup = React.forwardRef((
  {
    startElement,
    startElementProps,
    endElement,
    endElementProps,
    children,
    startOffset = "6px",
    endOffset = "6px",
    ...rest
  }: InputGroupProps,
  ref: any
) => {
  const child = React.Children.only(children)

  return (
    <ChakraInputGroup ref={ref} {...rest}>
      {startElement && (
        <InputLeftElement pointerEvents="none" {...startElementProps}>
          {startElement}
        </InputLeftElement>
      )}
      {React.cloneElement(child, {
        ...(startElement && {
          ps: `calc(var(--input-height) - ${startOffset})`,
        }),
        ...(endElement && { pe: `calc(var(--input-height) - ${endOffset})` }),
        ...children.props,
      })}
      {endElement && (
        <InputRightElement {...endElementProps}>
          {endElement}
        </InputRightElement>
      )}
    </ChakraInputGroup>
  )
})
