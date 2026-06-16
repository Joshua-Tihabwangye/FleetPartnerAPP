import React, { useEffect, useState } from "react";
import { auth } from "../../utils/auth";

interface OidcAuthInitializerProps {
  children: React.ReactNode;
}

export default function OidcAuthInitializer({ children }: OidcAuthInitializerProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        if (auth.isCallbackUrl()) {
          await auth.signinRedirectCallback();
          if (!cancelled) {
            window.location.replace("/#/dashboard");
          }
          return;
        }

        await auth.initializeAuth();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Authentication failed";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="max-w-md text-center space-y-3">
          <div className="text-4xl">🔒</div>
          <h1 className="text-xl font-semibold">Authentication error</h1>
          <p className="text-sm text-slate-300">{error}</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-ev-green text-ev-slate font-medium hover:bg-ev-green-dark"
          >
            Sign in with EVzone Accounts
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-ev-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Signing you in...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
