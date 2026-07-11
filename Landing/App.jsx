import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Route,
  FileJson,
  Send,
  BookOpen,
  Github,
  ChevronRight,
} from "lucide-react";

/* -------------------------------------------------------------------------
 * Mockless — Landing page (v2)
 * Sections: Navbar · Hero · ProductExplainer · HowItWorks ·
 *           InteractiveWidget · Benefits · Integrations · Pricing ·
 *           FAQ · FinalCTA · Footer
 * Split 1:1 into their own files if wiring this into a real project.
 * ---------------------------------------------------------------------- */

const BASE_HOST = "mockless.dev/api";

/* -------------------------------------------------------------------------
 * Navbar.jsx — blurs/solidifies on scroll, Docs is emphasized
 * ---------------------------------------------------------------------- */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "border-zinc-800 bg-zinc-950/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500">
            <Terminal className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">Mockless</span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-[13.5px] font-medium text-zinc-400 transition-colors hover:text-white">
            Features
          </a>
          <a
            href="#docs"
            className="flex items-center gap-1 text-[13.5px] font-semibold text-zinc-200 transition-colors hover:text-white"
          >
            <BookOpen className="h-3.5 w-3.5 text-purple-400" />
            Docs
          </a>
          <a href="#pricing" className="text-[13.5px] font-medium text-zinc-400 transition-colors hover:text-white">
            Pricing
          </a>
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <a href="#signin" className="text-[13.5px] font-medium text-zinc-400 transition-colors hover:text-white">
            Sign in
          </a>
          <a
            href="#get-started"
            className="rounded-lg bg-purple-500 px-4 py-2 text-[13.5px] font-medium text-white shadow-[0_0_0_0_rgba(168,85,247,0.5)] transition-all hover:bg-purple-400 hover:shadow-[0_0_20px_2px_rgba(168,85,247,0.35)]"
          >
            Get started free
          </a>
        </div>

        <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" className="text-zinc-400 md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-[14px] text-zinc-400">Features</a>
            <a href="#docs" className="text-[14px] font-semibold text-white">Docs</a>
            <a href="#pricing" className="text-[14px] text-zinc-400">Pricing</a>
            <a href="#signin" className="text-[14px] text-zinc-400">Sign in</a>
            <a href="#get-started" className="rounded-lg bg-purple-500 px-4 py-2 text-center text-[14px] font-medium text-white">
              Get started free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* -------------------------------------------------------------------------
 * Hero.jsx — new headline/copy, floating badge, gradient blob, mouse glow
 * ---------------------------------------------------------------------- */
function Hero() {
  const containerRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden px-6 pb-16 pt-28 text-center"
    >
      {/* slow-drifting gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl animate-slow-drift"
      />
      {/* mouse-follow glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl transition-[left,top] duration-300 ease-out"
        style={{ left: `${glow.x}%`, top: `${glow.y}%`, transform: "translate(-50%, -50%)" }}
      />

      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-6 inline-flex animate-float items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[12px] font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Now shipping edge deploys
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Build frontend{" "}
          <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            before backend
          </span>{" "}
          exists.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-zinc-400">
          Create hosted mock API endpoints in seconds. Return custom JSON, test instantly, and keep
          shipping without waiting for backend development.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#get-started"
            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-500 px-5 py-2.5 text-[14px] font-medium text-white shadow-[0_0_0_0_rgba(168,85,247,0.5)] transition-all hover:bg-purple-400 hover:shadow-[0_0_24px_4px_rgba(168,85,247,0.35)]"
          >
            Create your first endpoint
          </a>
          <a
            href="#docs"
            className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-[14px] font-medium text-zinc-300 transition-colors hover:text-white"
          >
            View documentation
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * ProductExplainer.jsx — one-glance explanation right after the hero
 * ---------------------------------------------------------------------- */
function ProductExplainer() {
  return (
    <section className="px-6 pb-6 pt-2 text-center">
      <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-zinc-400">
        Mockless lets you create hosted REST API endpoints that return custom JSON responses —
        so frontend development never waits on backend work.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * HowItWorks.jsx — three-step horizontal flow
 * ---------------------------------------------------------------------- */
function HowItWorks() {
  const steps = [
    { icon: Route, title: "Create a route", body: "Define a path like /api/users." },
    { icon: FileJson, title: "Paste your response", body: "Drop in the JSON you want returned." },
    { icon: Send, title: "Start sending requests", body: "Your endpoint is live immediately." },
  ];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Three steps. One endpoint.</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="relative flex flex-col items-center">
              {i < steps.length - 1 && (
                <ChevronRight className="absolute -right-3 top-6 hidden h-5 w-5 text-zinc-700 sm:block" />
              )}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-purple-400">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[14px] font-medium text-white">
                <span className="mr-1.5 text-zinc-600">{i + 1}.</span>
                {title}
              </p>
              <p className="mt-1 text-[13px] text-zinc-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * InteractiveWidget.jsx — renamed panels, typing animation, URL shimmer
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
  const [typedBody, setTypedBody] = useState("");
  const [shimmerKey, setShimmerKey] = useState(0);

  const liveUrl = `https://${BASE_HOST}${path}`;

  const send = () => {
    setRequestState("loading");
    setTimeout(() => {
      setRequestState("done");
      setShimmerKey((k) => k + 1);
    }, 550);
  };

  useEffect(() => {
    setRequestState("idle");
    setTypedBody("");
  }, [path, body]);

  const isValidBody = useMemo(() => {
    try {
      JSON.parse(body || "{}");
      return true;
    } catch {
      return false;
    }
  }, [body]);

  // type out the response body once the request "completes"
  useEffect(() => {
    if (requestState !== "done") return;
    const full = isValidBody ? body : "{}";
    let i = 0;
    setTypedBody("");
    const interval = setInterval(() => {
      i += 2;
      setTypedBody(full.slice(0, i));
      if (i >= full.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [requestState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="try-it" className="px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/40 p-2 sm:p-3">
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          {/* Left column — write response */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-zinc-500">
              Write response
            </p>

            <div className="flex items-stretch overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="relative">
                <select
                  value={method}
                  disabled
                  className="h-full appearance-none border-r border-zinc-800 bg-transparent py-2.5 pl-3 pr-8 text-[13px] font-bold text-purple-400 outline-none"
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

          {/* Right column — live endpoint */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-zinc-500">Live endpoint</p>

            <div
              key={shimmerKey}
              className="flex items-center gap-2 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-3 pr-1.5 animate-shimmer"
            >
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
                      {typedBody}
                      <span className="animate-pulse">▍</span>
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
 * Benefits.jsx — bento layout, benefit-focused titles, card lift on hover
 * ---------------------------------------------------------------------- */
function Benefits() {
  const features = [
    {
      icon: Zap,
      title: "Mock any route",
      body: "Support GET, POST, PUT, PATCH, and DELETE with custom responses and status codes.",
      span: "sm:col-span-2",
    },
    {
      icon: CloudCog,
      title: "Deploy in seconds",
      body: "No Docker, no servers, no local config. Deploy instantly to the edge.",
      span: "",
    },
    {
      icon: Users,
      title: "Built for teams",
      body: "Share endpoints with teammates or integrate them into CI/CD pipelines.",
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
              className={`rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40 ${span}`}
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                <Icon className="h-4.5 w-4.5 text-purple-400" />
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
 * Integrations.jsx — trust signals via framework chips
 * ---------------------------------------------------------------------- */
function Integrations() {
  const frameworks = ["React", "Next.js", "Vue", "Angular", "Flutter", "React Native"];
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[12px] font-medium uppercase tracking-wider text-zinc-500">Works with your stack</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {frameworks.map((name) => (
            <span
              key={name}
              className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-[13px] font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Pricing.jsx
 * ---------------------------------------------------------------------- */
function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      cta: "Start for free",
      highlight: false,
      features: ["5 active mocks", "100 requests / day", "Community support"],
    },
    {
      name: "Builder",
      price: "$19",
      period: "/ month",
      cta: "Start building",
      highlight: true,
      features: ["Unlimited mocks", "50k requests / day", "Custom status codes", "Priority support"],
    },
    {
      name: "Team",
      price: "$49",
      period: "/ month",
      cta: "Talk to us",
      highlight: false,
      features: ["Everything in Builder", "Shared workspaces", "CI/CD integration", "SSO"],
    },
  ];

  return (
    <section id="pricing" className="px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Simple, developer-friendly pricing</h2>
        <p className="mt-2 text-[14px] text-zinc-400">Start free. Upgrade when your team needs more.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-6 text-left transition-all duration-200 hover:-translate-y-1 ${
                tier.highlight
                  ? "border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-500/10"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              <p className="text-[14px] font-medium text-white">{tier.name}</p>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-white">{tier.price}</span>
                <span className="text-[12.5px] text-zinc-500">{tier.period}</span>
              </p>

              <ul className="mt-5 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-zinc-400">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-6 w-full rounded-lg px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  tier.highlight
                    ? "bg-purple-500 text-white hover:bg-purple-400"
                    : "border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * FAQ.jsx — simple accordion
 * ---------------------------------------------------------------------- */
function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-zinc-800 py-4">
      <button onClick={onToggle} className="flex w-full items-center justify-between text-left">
        <span className="text-[14px] font-medium text-white">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <p className="mt-2.5 text-[13.5px] leading-relaxed text-zinc-400">{a}</p>}
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Do I need to write any backend code?",
      a: "No. You define a path and a JSON response, and Mockless hosts the endpoint for you — no server or Docker setup required.",
    },
    {
      q: "Can I use custom status codes?",
      a: "Yes. Every mock can return any status code you choose, including 400, 404, and 500, alongside your custom JSON body.",
    },
    {
      q: "Is this safe to use in CI/CD pipelines?",
      a: "Yes. Mocks are hosted on stable URLs, so you can point automated tests or CI pipelines at them just like a real API.",
    },
    {
      q: "What happens when my real backend is ready?",
      a: "Swap the base URL back to your production API — your frontend code doesn't need to change since it was already calling a real REST endpoint.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-white">Frequently asked questions</h2>
        <div className="mt-8">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.q}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * FinalCTA.jsx
 * ---------------------------------------------------------------------- */
function FinalCTA() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-4 py-2 font-mono text-[13px] text-emerald-400">
          <Terminal className="h-3.5 w-3.5 text-zinc-500" />
          npm install -g mockless-cli
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Stop blocking frontend development.
        </h2>
        <p className="mt-2 text-[14px] text-zinc-400">Your backend can arrive later.</p>

        <a
          href="#get-started"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-purple-500 px-5 py-2.5 text-[14px] font-medium text-white shadow-[0_0_0_0_rgba(168,85,247,0.5)] transition-all hover:bg-purple-400 hover:shadow-[0_0_24px_4px_rgba(168,85,247,0.35)]"
        >
          Create your first mock API
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * Footer.jsx — expanded columns
 * ---------------------------------------------------------------------- */
function Footer() {
  const columns = [
    { title: "Product", links: ["Features", "Pricing", "Docs", "Blog"] },
    { title: "Resources", links: ["Changelog", "Status", "Roadmap", "GitHub"] },
    { title: "Legal", links: ["Privacy", "Terms"] },
  ];

  return (
    <footer className="border-t border-zinc-800 px-6 pb-10 pt-14">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500">
                <Terminal className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[14px] font-semibold text-white">Mockless</span>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-500">
              Hosted mock APIs for frontend teams who don't want to wait.
            </p>
            <a
              href="#github"
              className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-zinc-500 hover:text-zinc-300"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] font-medium uppercase tracking-wider text-zinc-500">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-[13px] text-zinc-400 hover:text-zinc-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-6 text-center text-[12.5px] text-zinc-600">
          © {new Date().getFullYear()} Mockless. Built for developers who don't want to wait.
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------
 * App.jsx — top-level assembly
 * Page order: Hero → Explainer → How It Works → Interactive Demo →
 *             Benefits → Integrations → Pricing → FAQ → Final CTA → Footer
 * ---------------------------------------------------------------------- */
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <Navbar />
      <Hero />
      <ProductExplainer />
      <HowItWorks />
      <InteractiveWidget />
      <Benefits />
      <Integrations />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
