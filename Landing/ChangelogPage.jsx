import React from "react";
import { Link } from "react-router-dom";
import { Terminal, ArrowLeft } from "lucide-react";

const releases = [
  {
    version: "v0.4.0",
    date: "July 2026",
    tag: "New",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    items: [
      "Custom status codes for every mock (400, 404, 500, or any code you choose)",
      "Shareable mock URLs for team workspaces",
      "Response latency simulation for more realistic testing",
    ],
  },
  {
    version: "v0.3.0",
    date: "May 2026",
    tag: "Improved",
    tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    items: [
      "Faster edge propagation — new mocks go live in under a second",
      "JSON validation with inline error messages in the editor",
      "Format JSON utility button in the response editor",
    ],
  },
  {
    version: "v0.2.0",
    date: "March 2026",
    tag: "New",
    tagColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    items: [
      "Support for PUT and PATCH methods",
      "cURL snippet generator for every endpoint",
      "Dashboard redesign with a live URL panel",
    ],
  },
  {
    version: "v0.1.0",
    date: "January 2026",
    tag: "Launch",
    tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    items: [
      "Initial release: GET and POST mock endpoints",
      "Hosted JSON responses with a generated live URL",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <header className="border-b border-zinc-800 px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500">
              <Terminal className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-white">Mockless</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[13.5px] font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Changelog</h1>
        <p className="mt-2 text-[14px] text-zinc-400">Everything shipped to Mockless, newest first.</p>

        <div className="mt-12 space-y-12 border-l border-zinc-800 pl-8">
          {releases.map((release) => (
            <div key={release.version} className="relative">
              <span className="absolute -left-[calc(2rem+5px)] top-1 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-orange-500" />
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-mono text-[15px] font-semibold text-white">{release.version}</h2>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${release.tagColor}`}>
                  {release.tag}
                </span>
                <span className="text-[12.5px] text-zinc-500">{release.date}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {release.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-zinc-400">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
