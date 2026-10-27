import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      {/* SignIn reads the URL, so it must sit inside Suspense with cacheComponents */}
      <Suspense>
        <SignIn />
      </Suspense>
    </main>
  );
}
