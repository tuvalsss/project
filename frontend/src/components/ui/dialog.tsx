import {
  Modal,
  Portal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import * as React from "react"
import { CloseButton } from "./close-button"

interface DialogContentProps {
  portalled?: boolean
  portalRef?: any
  backdrop?: boolean
  children?: any
  [key: string]: any
}

export const DialogContent = React.forwardRef(
  function DialogContent(
    { children, portalled = true, portalRef, backdrop = true, ...rest }: DialogContentProps,
    ref: any
  ) {
    return (
      <Portal disabled={!portalled} container={portalRef}>
        {backdrop && <ModalOverlay />}
        <ModalContent ref={ref} {...rest}>
          {children}
        </ModalContent>
      </Portal>
    )
  }
)

interface DialogCloseTriggerProps {
  children?: any
  [key: string]: any
}

export const DialogCloseTrigger = React.forwardRef(
  function DialogCloseTrigger(
    props: DialogCloseTriggerProps,
    ref: any
  ) {
    return (
      <ModalCloseButton
        position="absolute"
        top="2"
        right="2"
        {...props}
      >
        <CloseButton size="sm" ref={ref}>
          {props.children}
        </CloseButton>
      </ModalCloseButton>
    )
  }
)

interface DialogActionTriggerProps {
  children?: any
  [key: string]: any
}

export const DialogActionTrigger = React.forwardRef(
  function DialogActionTrigger(
    props: DialogActionTriggerProps,
    ref: any
  ) {
    return (
      <ModalCloseButton {...props}>
        {props.children}
      </ModalCloseButton>
    )
  }
)

export const DialogRoot = Modal
export const DialogFooter = ModalFooter
export const DialogHeader = ModalHeader
export const DialogBody = ModalBody
export const DialogBackdrop = ModalOverlay
export const DialogTitle = ModalHeader
export const DialogDescription = ModalBody
export const DialogTrigger = ModalContent
