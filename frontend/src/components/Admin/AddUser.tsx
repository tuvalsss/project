import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { type UserCreate, type UserPublic } from "@/client/types.gen"
import { handleError } from "@/utils"
import useCustomToast from "@/hooks/useCustomToast"
import {
  Button,
  Flex,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Checkbox } from "../ui/checkbox"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  DialogTitle,
  DialogActionTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"
import type { ApiError } from "@/client/core/ApiError"

interface UserCreateForm extends UserCreate {
  confirm_password: string
}

const AddUser = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UserCreateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      is_superuser: false,
      is_active: false,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: UserCreate) => {
      const response = await fetch('/api/v1/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestBody: data }),
      })
      if (!response.ok) {
        throw await response.json()
      }
      return response.json() as Promise<UserPublic>
    },
    onSuccess: () => {
      showSuccessToast("User created successfully.")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const onSubmit: SubmitHandler<UserCreateForm> = (data) => {
    const { confirm_password, ...userData } = data
    mutation.mutate(userData)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button leftIcon={<FaPlus size="0.85em" />} size="sm">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <VStack spacing={4} align="stretch">
              <Field
                label="Email"
                error={errors.email?.message}
                required
              >
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder="Enter email"
                />
              </Field>
              <Field
                label="Full Name"
                error={errors.full_name?.message}
              >
                <Input
                  {...register("full_name")}
                  type="text"
                  placeholder="Enter full name"
                />
              </Field>
              <Field
                label="Password"
                error={errors.password?.message}
                required
              >
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type="password"
                  placeholder="Enter password"
                />
              </Field>
              <Field
                label="Confirm Password"
                error={errors.confirm_password?.message}
                required
              >
                <Input
                  {...register("confirm_password", {
                    required: "Please confirm password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                  type="password"
                  placeholder="Confirm password"
                />
              </Field>
              <Controller
                name="is_superuser"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    checked={value}
                    onCheckedChange={(checked: boolean) => onChange(checked)}
                    label="Is Superuser"
                  />
                )}
              />
              <Controller
                name="is_active"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    checked={value}
                    onCheckedChange={(checked: boolean) => onChange(checked)}
                    label="Is Active"
                  />
                )}
              />
            </VStack>
          </DialogBody>
          <DialogFooter>
            <Flex gap={2} justify="flex-end">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>
              <DialogActionTrigger asChild>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                >
                  Create User
                </Button>
              </DialogActionTrigger>
            </Flex>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default AddUser
