"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  SignupSchemaType,
  genderEnum,
  signupSchema,
} from "@/schemas/SignupSchema";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/auth/register";
import { formatGenderDisplay } from "@/helpers/formHelpers";
import { useRouter } from "next/navigation";
import { CustomError } from "@/auth/types";
import { ROUTES } from "@/constants/routes";

export default function ResigterForm() {
  const router = useRouter();
  const { mutate: signUpMutation, error } = useMutation<
    unknown,
    CustomError,
    SignupSchemaType
  >({
    mutationFn: registerUser,
    onSuccess: () => {
      router.replace(ROUTES.completProfile);
    },
  });

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      age: 0,
      username: "",
    },
  });

  const onSubmit = async (data: SignupSchemaType) => {
    signUpMutation(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="first name" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="last name" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="Password" placeholder="Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Age" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-transparent border-[#E8CFD6] placeholder:text-[#994D66] outline-none">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className=" bg-white border-[#E8CFD6] placeholder:text-[#994D66] outline-none">
                  <SelectItem value={genderEnum.MALE}>
                    {formatGenderDisplay(genderEnum.MALE)}
                  </SelectItem>
                  <SelectItem value={genderEnum.FEMALE}>
                    {formatGenderDisplay(genderEnum.FEMALE)}
                  </SelectItem>
                  <SelectItem value={genderEnum.OTHER}>
                    {formatGenderDisplay(genderEnum.OTHER)}
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormMessage>{error?.response?.data?.message}</FormMessage>}

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={form.formState.isSubmitting}
        >
          Create account
        </Button>
      </form>
    </Form>
  );
}
