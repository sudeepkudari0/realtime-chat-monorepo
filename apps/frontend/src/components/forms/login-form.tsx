"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import Cookies from "universal-cookie";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message:
      "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special case character.",
  }),
});

interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cookies = new Cookies();
  const TOKEN_KEY = "auth_token";
  const COOKIE_OPTIONS = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    maxAge: 60 * 60 * 24 * 7,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"}/api/auth/local`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: values.username,
          password: values.password,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      setIsLoading(false);
      return toast.error(errorData?.error?.message || "Login failed");
    }

    const data: AuthResponse = await response.json();

    cookies.set(TOKEN_KEY, data.jwt, COOKIE_OPTIONS);

    toast.success("Login successful!");
    setIsLoading(false);
    return redirect("/dashboard");
  }
  return (
    <>
      <Card className="mx-auto grid w-[400px]">
        <CardHeader className="flex flex-col items-start">
          <h1 className="text-lg font-bold font-opensans">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">
            Enter your username to sign in to your account
          </p>
        </CardHeader>
        <CardContent className="">
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" block text-sm font-medium text-zinc-400">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Username"
                          className="peer block w-full border-2 bg-background focus:border-blue-600 focus:outline-none focus:ring-3 appearance-none text-sm outline-none placeholder:text-zinc-500 dark:bg-zinc-950"
                          {...field}
                        />
                      </div>
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
                    <div className="flex flex-row items-center justify-between">
                      <FormLabel className=" block text-sm font-medium text-zinc-400">
                        Password
                      </FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput
                        placeholder="Password"
                        {...field}
                        inputClassName="peer block w-full border-2 bg-transparent focus:border-blue-600 focus:outline-none focus:ring-3 appearance-none text-sm outline-none placeholder:text-zinc-500 dark:bg-zinc-950"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error?.message} />
              <LoadingButton
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                onClick={form.handleSubmit(onSubmit)}
                variant={"default"}
                className="w-full rounded-2xl text-sm border bg-white text-black hover:text-white hover:bg-blue-600 dark:bg-zinc-600 dark:text-white dark:hover:bg-blue-600"
              >
                Login
              </LoadingButton>
              <div className="flex flex-row items-center justify-center gap-1 text-sm">
                <span className="text-zinc-500">Dont have an account?</span>
                <Link
                  href="/register"
                  className=" text-sm text-blue-500 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
          <div className="flex my-4 flex-row items-center w-full">
            <hr className="w-full" />
            <span className="mx-2 text-[12px] font-bold text-gray-500">OR</span>
            <hr className="w-full" />
          </div>{" "}
          <div className="mt-4">
            <Link
              href={"/api/login/google"}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full rounded-2xl text-sm flex flex-row items-center gap-4 border bg-white text-black hover:text-white hover:bg-blue-600 dark:bg-zinc-600 dark:text-white dark:hover:bg-blue-600"
              )}
            >
              <Image
                src={"/google.svg"}
                alt="Google Logo"
                width={20}
                height={20}
              />
              Continue with Google
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
