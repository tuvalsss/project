import { FormControl, FormLabel, FormHelperText, FormErrorMessage } from "@chakra-ui/react"
import { forwardRef } from "react"

interface FieldProps {
  label?: string | JSX.Element
  helperText?: string | JSX.Element
  errorText?: string | JSX.Element
  optionalText?: string | JSX.Element
  isRequired?: boolean
  isInvalid?: boolean
  children?: any
  [key: string]: any
}

export const Field = forwardRef((
  { label, children, helperText, errorText, optionalText, isRequired, isInvalid, ...rest }: FieldProps,
  ref: any
) => {
  return (
    <FormControl 
      ref={ref} 
      isRequired={isRequired} 
      isInvalid={isInvalid} 
      {...rest}
    >
      {label && (
        <FormLabel>
          {label}
          {!isRequired && optionalText && (
            <span style={{ marginLeft: '0.5em', opacity: 0.7 }}>{optionalText}</span>
          )}
        </FormLabel>
      )}
      {children}
      {helperText && !isInvalid && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {errorText && isInvalid && (
        <FormErrorMessage>{errorText}</FormErrorMessage>
      )}
    </FormControl>
  )
})

Field.displayName = "Field"
