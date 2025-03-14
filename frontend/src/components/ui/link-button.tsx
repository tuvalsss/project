"use client"

import { Button } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface LinkButtonProps {
  href: string
  children?: React.ReactNode
  [key: string]: any
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (props: LinkButtonProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
    const { href, children, ...rest } = props
    return (
      <Button
        as="a"
        href={href}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    )
  }
)

LinkButton.displayName = "LinkButton"
