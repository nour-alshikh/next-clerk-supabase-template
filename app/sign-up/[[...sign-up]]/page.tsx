import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      {/* SignUp reads the URL, so it must sit inside Suspense with cacheComponents */}
      <Suspense>
        <SignUp />
      </Suspense>
    </main>
  );
}
