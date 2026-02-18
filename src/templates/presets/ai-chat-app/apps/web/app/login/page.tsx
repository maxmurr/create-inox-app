import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <Suspense fallback={<Spinner className="size-6" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
