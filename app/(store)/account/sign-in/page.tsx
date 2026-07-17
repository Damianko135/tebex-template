import { SignInPanel } from "@/components/store/sign-in-panel";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-3xl tracking-tight">Sign in</h1>
      <p className="mt-2 text-muted-foreground">
        Authorize your basket to unlock member pricing, creator codes, and subscription tiers tied to
        your account.
      </p>
      <div className="mt-8 flex justify-center">
        <SignInPanel />
      </div>
    </div>
  );
}
