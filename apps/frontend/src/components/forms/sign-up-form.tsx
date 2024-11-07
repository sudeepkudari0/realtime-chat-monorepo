"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormError } from "@/components/ui/error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordTooltipHint } from "@/components/ui/password-check-tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/app/(auth)/register/action";

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Please enter a username.",
    }),
    password: z
      .string()
      .min(6, {
        message:
          "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special case character.",
      })
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/,
        "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special case character."
      ),
    confirmPassword: z.string().min(1, {
      message: "Confirm password is required.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    const result = await register(values);
    if (result.success) {
      toast.success("Registration successful!");
      router.push("/dashboard");
    }

    if (result.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto grid w-[450px]">
      <CardHeader className="flex flex-col items-start">
        <h1 className="text-lg font-bold font-opensans">Sign Up</h1>
        <p className="text-zinc-400 text-sm">
          Enter your details to create your account
        </p>
      </CardHeader>
      <CardContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-zinc-400">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input {...field} id="username" />
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
                    <FormLabel className="font-semibold text-sm text-zinc-400">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center justify-between gap-3 w-full">
                        <PasswordInput {...field} />
                        <div className="flex items-end justify-end">
                          <PasswordTooltipHint value={field.value} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-zinc-400">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error?.message} />
              <div className="flex justify-between pt-1">
                <LoadingButton
                  type="submit"
                  // loading={isLoading}
                  // disabled={isLoading}
                  variant={"default"}
                  className="w-full rounded-2xl text-sm flex flex-row items-center border bg-white text-black hover:text-white hover:bg-blue-600 dark:bg-zinc-600 dark:text-white dark:hover:bg-blue-600"
                >
                  Sign Up
                </LoadingButton>
              </div>
            </>
          </form>
        </Form>
        <div className="flex flex-row items-center justify-center gap-1 text-sm mt-4">
          <span className="text-zinc-500">Already have an account?</span>
          <Link
            href="/sign-in"
            className="font-medium text-sm text-blue-500 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
