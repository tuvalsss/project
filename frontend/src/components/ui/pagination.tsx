"use client"

import {
  Button,
  IconButton,
  Text,
  HStack,
} from "@chakra-ui/react"
import * as React from "react"
import {
  HiChevronLeft,
  HiChevronRight,
  HiMiniEllipsisHorizontal,
} from "react-icons/hi2"
import { LinkButton } from "./link-button"

interface ButtonVariantMap {
  current: string
  default: string
  ellipsis: string
}

type PaginationVariant = "outline" | "solid" | "subtle"

interface ButtonVariantContext {
  size: string
  variantMap: ButtonVariantMap
  getHref?: (page: number) => string
}

interface Page {
  type: "ellipsis" | "page"
  value?: number
}

interface PaginationContextValue {
  page: number
  totalPages: number
  pageRange: { start: number; end: number }
  count: number
  previousPage: number | null
  nextPage: number | null
  pages: Page[]
}

const RootPropsContext = React.createContext(null as ButtonVariantContext | null)
const PaginationContext = React.createContext(null as PaginationContextValue | null)

function useRootProps() {
  const context = React.useContext(RootPropsContext)
  if (!context) {
    throw new Error("useRootProps must be used within a RootPropsProvider")
  }
  return context
}

function usePaginationContext() {
  const context = React.useContext(PaginationContext)
  if (!context) {
    throw new Error("usePaginationContext must be used within a PaginationProvider")
  }
  return context
}

export interface PaginationRootProps {
  size?: string
  variant?: PaginationVariant
  getHref?: (page: number) => string
  page?: number
  totalPages?: number
  count: number
  pageSize?: number
  onPageChange?: (props: { page: number }) => void
  [key: string]: any
}

const variantMap: Record<PaginationVariant, ButtonVariantMap> = {
  outline: { default: "ghost", ellipsis: "plain", current: "outline" },
  solid: { default: "outline", ellipsis: "outline", current: "solid" },
  subtle: { default: "ghost", ellipsis: "plain", current: "subtle" },
}

export const PaginationRoot = React.forwardRef(
  function PaginationRoot(
    { 
      size = "sm", 
      variant = "outline", 
      getHref, 
      page = 1, 
      totalPages: totalPagesProp, 
      count, 
      pageSize = 10,
      onPageChange,
      ...rest 
    }: PaginationRootProps,
    ref: any
  ) {
    const totalPages = totalPagesProp ?? Math.ceil(count / pageSize)
    const pageRange = React.useMemo(() => {
      const start = Math.max(1, page - 2)
      const end = Math.min(totalPages, page + 2)
      return { start, end }
    }, [page, totalPages])

    const pages = React.useMemo(() => {
      const result: Page[] = []
      if (pageRange.start > 1) {
        result.push({ type: "page", value: 1 })
        if (pageRange.start > 2) {
          result.push({ type: "ellipsis" })
        }
      }
      for (let i = pageRange.start; i <= pageRange.end; i++) {
        result.push({ type: "page", value: i })
      }
      if (pageRange.end < totalPages) {
        if (pageRange.end < totalPages - 1) {
          result.push({ type: "ellipsis" })
        }
        result.push({ type: "page", value: totalPages })
      }
      return result
    }, [pageRange, totalPages])

    const contextValue: PaginationContextValue = {
      page,
      totalPages,
      pageRange,
      count,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      pages,
    }

    return (
      <RootPropsContext.Provider
        value={{ 
          size, 
          variantMap: variantMap[variant], 
          getHref: getHref ?? (onPageChange ? (page) => `#${page}` : undefined)
        }}
      >
        <PaginationContext.Provider value={contextValue}>
          <HStack spacing={1} ref={ref} {...rest}>
            {rest.children}
          </HStack>
        </PaginationContext.Provider>
      </RootPropsContext.Provider>
    )
  }
)

export const PaginationEllipsis = React.forwardRef(
  function PaginationEllipsis(props: any, ref: any) {
    const { size, variantMap } = useRootProps()
    return (
      <Button as="span" variant={variantMap.ellipsis} size={size} ref={ref} {...props}>
        <HiMiniEllipsisHorizontal />
      </Button>
    )
  }
)

export const PaginationItem = React.forwardRef(
  function PaginationItem(props: any, ref: any) {
    const { page } = usePaginationContext()
    const { size, variantMap, getHref } = useRootProps()

    const current = page === props.value
    const variant = current ? variantMap.current : variantMap.default

    if (getHref) {
      return (
        <Button 
          as="a"
          href={getHref(props.value)} 
          variant={variant} 
          size={size}
          onClick={(e: { preventDefault: () => void }) => {
            if (props.onClick) {
              e.preventDefault()
              props.onClick({ page: props.value })
            }
          }}
        >
          {props.value}
        </Button>
      )
    }

    return (
      <Button 
        variant={variant} 
        size={size} 
        ref={ref} 
        onClick={() => props.onClick?.({ page: props.value })}
        {...props}
      >
        {props.value}
      </Button>
    )
  }
)

export const PaginationPrevTrigger = React.forwardRef(
  function PaginationPrevTrigger(props: any, ref: any) {
    const { size, variantMap, getHref } = useRootProps()
    const { previousPage } = usePaginationContext()

    if (getHref) {
      return (
        <IconButton
          as="a"
          href={previousPage != null ? getHref(previousPage) : undefined}
          variant={variantMap.default}
          size={size}
        >
          <HiChevronLeft />
        </IconButton>
      )
    }

    return (
      <IconButton
        variant={variantMap.default}
        size={size}
        ref={ref}
        {...props}
      >
        <HiChevronLeft />
      </IconButton>
    )
  }
)

export const PaginationNextTrigger = React.forwardRef(
  function PaginationNextTrigger(props: any, ref: any) {
    const { size, variantMap, getHref } = useRootProps()
    const { nextPage } = usePaginationContext()

    if (getHref) {
      return (
        <IconButton
          as="a"
          href={nextPage != null ? getHref(nextPage) : undefined}
          variant={variantMap.default}
          size={size}
        >
          <HiChevronRight />
        </IconButton>
      )
    }

    return (
      <IconButton
        variant={variantMap.default}
        size={size}
        ref={ref}
        {...props}
      >
        <HiChevronRight />
      </IconButton>
    )
  }
)

export const PaginationItems = (props: any) => {
  const { pages } = usePaginationContext()
  return (
    <>
      {pages.map((page: Page, index: number) => {
        return page.type === "ellipsis" ? (
          <PaginationEllipsis key={index} index={index} {...props} />
        ) : (
          <PaginationItem
            key={index}
            type="page"
            value={page.value}
            {...props}
          />
        )
      })}
    </>
  )
}

interface PageTextProps {
  format?: "short" | "compact" | "long"
  [key: string]: any
}

export const PaginationPageText = React.forwardRef(
  function PaginationPageText(props: PageTextProps, ref: any) {
    const { format = "compact", ...rest } = props
    const { page, totalPages, pageRange, count } = usePaginationContext()
    const content = React.useMemo(() => {
      if (format === "short") return `${page} / ${totalPages}`
      if (format === "compact") return `${page} of ${totalPages}`
      return `${pageRange.start + 1} - ${Math.min(
        pageRange.end,
        count,
      )} of ${count}`
    }, [format, page, totalPages, pageRange, count])

    return (
      <Text fontWeight="medium" ref={ref} {...rest}>
        {content}
      </Text>
    )
  }
)
