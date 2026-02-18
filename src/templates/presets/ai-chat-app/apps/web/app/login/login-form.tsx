"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await authClient.signIn.email(data);
    if (error) {
      form.setError("root", {
        message: error.message ?? "Invalid credentials",
      });
      return;
    }
    const from = searchParams.get("from") ?? "/chat";
    router.push(from);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={fieldState.invalid || undefined}
                  disabled={form.formState.isSubmitting}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  aria-invalid={fieldState.invalid || undefined}
                  disabled={form.formState.isSubmitting}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          {form.formState.errors.root && (
            <FieldError>{form.formState.errors.root.message}</FieldError>
          )}
        </CardContent>
        <CardFooter className="mt-2 flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
