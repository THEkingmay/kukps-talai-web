import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import AuthProvider from "./components/providers/AuthProvider";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 text-gray-800 antialiased font-sans">
        <span
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: A daytime control room that balances data density with a clean, light, accessible minimal UI.
OWN-WORLD: #ffffff, #f3f4f6, #374151, #0ea5e9, matte surfaces, 1px subtle dividers, monospaced data fields.
STORY: Students understand the shuttle tracking project and find the download button, while admins access their functional operational space securely.
FIRST VIEWPORT: A clean white canvas with a sharp grid, displaying live transit stats alongside a clear download and admin entry.
FORM: 6, seed key d22adbfb.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 font-sans">
      <div className="max-w-2xl w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-3 bg-red-50">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-lg font-semibold text-red-800 tracking-tight">System Alert: {message}</h1>
        </div>
        <div className="p-6">
          <p className="text-gray-700 font-medium mb-4">{details}</p>
          {stack && (
            <div className="mt-4 border border-gray-200 rounded bg-gray-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Trace Log
              </div>
              <pre className="w-full p-4 overflow-x-auto text-sm text-gray-600 font-mono leading-relaxed">
                <code>{stack}</code>
              </pre>
            </div>
          )}
          <div className="mt-6">
            <a href="/" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors">
              Return to Control Panel
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
