import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Terminal, ArrowLeft, Menu, X } from "lucide-react";

const guides = [
  {
    id: "quickstart",
    title: "Quickstart",
    body: (
      <>
        <p>
          Mockless lets you create a hosted API endpoint without writing any backend code. Every
          mock you create gets a live URL you can call from your frontend immediately.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-400">
          <li>Create a mock and choose a method and path, e.g. <code>GET /api/v1/users</code>.</li>
          <li>Paste the JSON you want returned.</li>
          <li>Copy the generated URL and call it from your app.</li>
        </ol>
      </>
    ),
  },
  {
    id: "methods",
    title: "HTTP methods",
    body: (
      <>
        <p>Mockless supports the standard REST verbs on every endpoint:</p>
        <ul className="mt-4 space-y-2 pl-5 text-zinc-400">
          <li><code className="text-orange-400">GET</code> — retrieve a mocked resource</li>
          <li><code className="text-blue-400">POST</code> — simulate creating a resource</li>
          <li><code className="text-amber-400">PUT</code> — simulate a full update</li>
          <li><code className="text-red-400">DELETE</code> — simulate removing a resource</li>
        </ul>
      </>
    ),
  },
  {
    id: "status-codes",
    title: "Status codes",
    body: (
      <p>
        Every mock defaults to <code>200 OK</code>, but can be configured to return{" "}
        <code>400</code>, <code>404</code>, <code>500</code>, or any custom code — useful for
        testing how your frontend handles error states before your backend exists.
      </p>
    ),
  },
  {
    id: "curl",
    title: "Testing with cURL",
    body: (
      <>
        <p>Every endpoint ships with a ready-to-copy cURL snippet:</p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-zinc-800 bg-black p-4 font-mono text-[13px] text-emerald-300">
{`curl -i -X GET \\
  https://mockless.dev/api/xyz123/api/v1/users`}
        </pre>
      </>
    ),
  },
  {
    id: "ci",
    title: "Using mocks in CI/CD",
    body: (
      <p>
        Because mock URLs are stable and hosted, you can point automated tests or pipeline steps
        directly at them — no need to spin up a local mock server as part of your build.
      </p>
    ),
  },
];

export default function DocsPage() {
  const [activeId, setActiveId] = useState(guides[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const active = guides.find((g) => g.id === activeId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <header className="border-b border-zinc-800 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500">
              <Terminal className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">Mockless</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden items-center gap-1.5 text-[13.5px] font-medium text-zinc-400 transition-colors hover:text-white sm:flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
            <button
              onClick={() => setMobileNavOpen((o) => !o)}
              className="text-zinc-400 sm:hidden"
              aria-label="Toggle guide navigation"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        {/* Left nav */}
        <aside
          className={`w-56 shrink-0 border-r border-zinc-800 px-4 py-8 sm:block ${
            mobileNavOpen ? "block" : "hidden"
          }`}
        >
          <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">Guides</p>
          <nav className="space-y-1">
            {guides.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setActiveId(g.id);
                  setMobileNavOpen(false);
                }}
                className={`block w-full rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-colors ${
                  activeId === g.id
                    ? "bg-orange-500/10 font-medium text-orange-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                {g.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-6 py-8 sm:px-10 sm:py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{active.title}</h1>
          <div className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-zinc-300">{active.body}</div>
        </main>
      </div>
    </div>
  );
}
