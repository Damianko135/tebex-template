import { SignInPanel } from "@/themes/default/shared";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-3xl tracking-tight">Sign in</h1>
      <p className="mt-2 text-muted-foreground">
        Sign in to apply member pricing, creator codes, and subscription tiers to your basket.
      </p>
      <div className="mt-8 flex justify-center">
        <SignInPanel />
      </div>
    </div>
  );
}
