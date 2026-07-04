import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import "../app/fonts";
import "../episodes";
import { reportLovableError } from "../app/lovable-error-reporting";
import { Button } from "@/domains/ui/button/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-f4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-display font-bold text-ink-strong">404</h1>
        <h2 className="mt-f4 text-h3 font-semibold text-ink">Nothing on this frequency.</h2>
        <p className="mt-f2 text-body text-ink-muted">That slide isn't in the rundown.</p>
        <div className="mt-f6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand px-f5 py-f2 font-mono text-eyebrow uppercase tracking-[0.2em] text-brand-ink transition-colors data-[hovered]:brightness-110"
          >
            Back to decks
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-f4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-h2 font-semibold tracking-tight text-ink-strong">
          Runtime hiccup
        </h1>
        <p className="mt-f2 text-body text-ink-muted">
          Something went sideways. Try again or head back to the deck picker.
        </p>
        <div className="mt-f6 flex flex-wrap justify-center gap-f2">
          <Button
            tone="brand"
            onPress={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Link
            to="/"
            className="tap-target inline-flex items-center justify-center rounded-full border border-hairline bg-surface px-f5 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink"
          >
            Decks
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "DevPULSE Labs — Show Runtime" },
      {
        name: "description",
        content:
          "Local touchscreen runtime for DevPULSE Labs — News, AngryVibes, and Eons of Stupidity.",
      },
      { property: "og:title", content: "DevPULSE Labs — Show Runtime" },
      {
        property: "og:description",
        content: "Local touchscreen runtime for DevPULSE Labs shows.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" data-brand="eos">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
