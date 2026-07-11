import React, { useState, useMemo, useEffect } from "react";
import {
  Terminal,
  Copy,
  Check,
  Play,
  ChevronDown,
  Zap,
  CloudCog,
  Users,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------
 * Mockless — Landing page
 * Sections: Navbar · Hero · InteractiveWidget · FeaturesGrid · FooterCTA
 * Each is a standalone component below — split 1:1 into its own file
 * (Navbar.jsx, Hero.jsx, ...) if wiring this into a real project.
 * ---------------------------------------------------------------------- */

const BASE_HOST = "mockless.dev/api";

/* -------------------------------------------------------------------------
 * Navbar.jsx
 * ---------------------------------------------------------------------- */
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = ["Features", "Docs", "Pricing"];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500">
            <Terminal className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">Mockless</span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[13.5px] font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <a href="#signin" className="text-[13.5px] font-medium text-zinc-400 transition-colors hover:text-white">
            Sign in
          </a>
          <a
            href="#get-started"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-indigo-400"
          >
            Get started free
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="text-zinc-400 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[14px] text-zinc-400">
                {link}
              </a>
            ))}
            <a href="#signin" className="text-[14px] text-zinc-400">
              Sign in
            </a>
            <a
              href="#get-started"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-center text-[14px] font-medium text-white"
            >
              Get started free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* -------------------------------------------------------------------------
 * Hero.jsx
 * ---------------------------------------------------------------------- */
function Hero() {
  return (
    <section className="px-6 pb-16 pt-40 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[12px] font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Now shipping edge deploys
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Stop waiting for the backend.
          <br />
          Mock endpoints{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            instantly.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-zinc-400">
          Create robust, hosted mock API routes in seconds. Speed up your frontend development
          workflow without writing a single line of backend code.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#get-started"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-indigo-400"
          >
            Start mocking for free
          </a>
          <a
            href="#docs"
            className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-[14px] font-medium text-zinc-300 transition-colors hover:text-white"
          >
            View docs
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * InteractiveWidget.jsx — "Try it live" playground
 * ---------------------------------------------------------------------- */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be unavailable in sandboxed preview */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      aria-label="Copy to clipboard"
      className="flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-700 px-2 py-1.5 text-[12px] font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function InteractiveWidget() {
  const [method] = useState("GET");
  const [path, setPath] = useState("/api/v1/users");
  const [body, setBody] = useState(`{
  "status": "success",
  "users": []
}`);
  const [requestState, setRequestState] = useState("idle"); // idle | loading | done

  const liveUrl = `https://${BASE_HOST}${path}`;

  const send = () => {
    setRequestState("loading");
    setTimeout(() => setRequestState("done"), 550);
  };

  useEffect(() => {
    setRequestState("idle");
  }, [path, body]);

  const isValidBody = useMemo(() => {
    try {
      JSON.parse(body || "{}");
      return true;
    } catch {
      return false;
    }
  }, [body]);

  return (
    <section id="try-it" className="px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/40 p-2 sm:p-3">
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          {/* Left column — configuration */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-zinc-500">
              Configure
            </p>

            <div className="flex items-stretch overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="relative">
                <select
                  value={method}
                  disabled
                  className="h-full appearance-none border-r border-zinc-800 bg-transparent py-2.5 pl-3 pr-8 text-[13px] font-bold text-emerald-400 outline-none"
                >
                  <option value="GET">GET</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
              </div>
              <input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/api/v1/users"
                className="flex-1 bg-transparent px-3 py-2.5 font-mono text-[13px] text-white outline-none placeholder:text-zinc-600"
              />
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-zinc-800 bg-black">
              <div className="flex items-center gap-1.5 border-b border-zinc-800 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-500/70" />
                <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                <span className="ml-2 font-mono text-[11px] text-zinc-500">response.json</span>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                spellCheck={false}
                rows={5}
                className="w-full resize-none bg-transparent px-3 py-2.5 font-mono text-[12.5px] leading-6 text-emerald-300 outline-none"
              />
            </div>
          </div>

          {/* Right column — output */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-zinc-500">Output</p>

            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-3 pr-1.5">
              <span className="flex-1 truncate font-mono text-[12.5px] text-zinc-200">{liveUrl}</span>
              <CopyButton text={liveUrl} />
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-zinc-800 bg-black">
              <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
                <span className="font-mono text-[11px] text-zinc-500">terminal</span>
                <button
                  onClick={send}
                  disabled={requestState === "loading"}
                  className="flex items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-[11.5px] font-medium text-zinc-200 transition-colors hover:bg-zinc-700 disabled:opacity-60"
                >
                  <Play className="h-3 w-3" />
                  {requestState === "loading" ? "Sending..." : "Send live request"}
                </button>
              </div>

              <div className="min-h-[132px] p-3 font-mono text-[12px] leading-6">
                {requestState === "idle" && (
                  <p className="text-zinc-600">
                    $ waiting to send request
                    <span className="ml-0.5 animate-pulse">▍</span>
                  </p>
                )}
                {requestState === "loading" && (
                  <p className="flex items-center gap-2 text-zinc-500">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />
                    connecting to {liveUrl}...
                  </p>
                )}
                {requestState === "done" && (
                  <div>
                    <p>
                      <span className="text-emerald-400">HTTP/1.1 200</span>
                      <span className="text-zinc-500"> OK</span>
                    </p>
                    <p className="text-zinc-500">content-type: application/json</p>
                    <pre className="mt-2 whitespace-pre-wrap text-zinc-200">
                      {isValidBody ? body : "{}"}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * FeaturesGrid.jsx — bento layout
 * ---------------------------------------------------------------------- */
function FeaturesGrid() {
  const features = [
    {
      icon: Zap,
      title: "Dynamic routes",
      body: "Support for GET, POST, PUT, and DELETE with custom status codes.",
      span: "sm:col-span-2",
    },
    {
      icon: CloudCog,
      title: "Zero setup",
      body: "No Docker, no servers, no local config. Deploy instantly to the edge.",
      span: "",
    },
    {
      icon: Users,
      title: "Team collaboration",
      body: "Share endpoints with your team or use them directly in CI/CD pipelines.",
      span: "",
    },
  ];

  return (
    <section id="features" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Built for how frontend teams actually work</h2>
        <p className="mt-2 max-w-lg text-[14px] text-zinc-400">
          Everything you need to stop blocking on a backend that isn't ready yet.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body, span }) => (
            <div
              key={title}
              className={`rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700 ${span}`}
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                <Icon className="h-4.5 w-4.5 text-indigo-400" />
              </div>
              <h3 className="text-[15px] font-medium text-white">{title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * FooterCTA.jsx
 * ---------------------------------------------------------------------- */
function FooterCTA() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-4 py-2 font-mono text-[13px] text-emerald-400">
          <Terminal className="h-3.5 w-3.5 text-zinc-500" />
          npm install -g mockless-cli
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Build at the speed of thought.
        </h2>

        <a
          href="#get-started"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-indigo-400"
        >
          Deploy your first mock
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <footer className="mx-auto mt-16 max-w-5xl border-t border-zinc-800 pt-8 text-center text-[12.5px] text-zinc-600">
        © {new Date().getFullYear()} Mockless. Built for developers who don't want to wait.
      </footer>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * App.jsx — top-level assembly
 * ---------------------------------------------------------------------- */
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <Navbar />
      <Hero />
      <InteractiveWidget />
      <FeaturesGrid />
      <FooterCTA />
    </div>
  );
}
