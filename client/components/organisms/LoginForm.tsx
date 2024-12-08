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

import { LoginSchemaType, loginSchema } from "@/schemas/SignupSchema";
import { useMutation } from "@tanstack/react-query";
import { userLogin } from "@/auth/login";
import { useRouter } from "next/navigation";
import { CustomError } from "@/auth/types";

export default function LoginForm() {
  const router = useRouter();
  const { mutate: loginMutation, error } = useMutation<
    unknown,
    CustomError,
    LoginSchemaType
  >({
    mutationFn: userLogin,
    onSuccess: () => {
      router.push("/home");
    },
  });

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // eslint-disable-next-line no-unused-vars
  const onSubmit = async (data: LoginSchemaType) => {
    loginMutation(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
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

        {error && <FormMessage>{error.response?.data?.message}</FormMessage>}

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={form.formState.isSubmitting}
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
}
