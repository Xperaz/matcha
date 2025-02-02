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
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const { mutate: loginMutation, error } = useMutation<
    unknown,
    CustomError,
    LoginSchemaType
  >({
    mutationFn: userLogin,
    onSuccess: () => {
      router.replace(ROUTES.app);
    },
  });

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
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
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#E51A5C] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <FormControl>
                <Input type="Password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <FormMessage>{error.response?.data?.message}</FormMessage>}

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#E51A5C] hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>

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
