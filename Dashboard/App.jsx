import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Terminal,
  Plus,
  Settings,
  Copy,
  Check,
  Play,
  Wand2,
  Trash2,
  ArrowRight,
  ChevronDown,
  AlertCircle,
  CreditCard,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------
 * Mockless — Frontend
 * Single-file assembly of the component set described in the brief:
 *   Sidebar · EmptyState · MockForm · ResponseEditor · LiveDeploymentPanel ·
 *   TerminalPreview
 * Split into separate files (Sidebar.jsx, MockForm.jsx, ...) 1:1 if wiring
 * this into a real Vite project — each section below is already an
 * independent, self-contained component.
 * ---------------------------------------------------------------------- */

const METHODS = [
  { value: "GET", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { value: "POST", text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  { value: "PUT", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { value: "DELETE", text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
];

const STATUS_CODES = [
  { value: 200, label: "200 OK" },
  { value: 201, label: "201 Created" },
  { value: 400, label: "400 Bad Request" },
  { value: 404, label: "404 Not Found" },
  { value: 500, label: "500 Internal Server Error" },
];

const BASE_HOST = "mockless.dev/api";

function methodStyle(method) {
  return METHODS.find((m) => m.value === method) || METHODS[0];
}

function makeShortId() {
  return Math.random().toString(36).slice(2, 8);
}

function makeMock(index) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `mock-${Date.now()}-${index}`,
    shortId: makeShortId(),
    method: "GET",
    path: "/api/v1/users",
    status: 200,
    body: `{
  "id": 1,
  "name": "Ada Lovelace",
  "role": "engineer"
}`,
  };
}

/* -------------------------------------------------------------------------
 * Sidebar.jsx
 * ---------------------------------------------------------------------- */
function Sidebar({ mocks, activeId, onSelect, onCreate, onDelete }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
          <Terminal className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">Mockless</span>
      </div>

      <div className="px-3">
        <button
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Create new mock
        </button>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-3">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Active mocks — {mocks.length}
        </p>

        {mocks.length === 0 ? (
          <p className="px-2 py-3 text-[13px] leading-relaxed text-slate-600">
            Nothing deployed yet. Create your first mock to see it here.
          </p>
        ) : (
          <ul className="space-y-1">
            {mocks.map((mock) => {
              const style = methodStyle(mock.method);
              const isActive = mock.id === activeId;
              return (
                <li key={mock.id} className="group relative">
                  <button
                    onClick={() => onSelect(mock.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                      isActive ? "bg-slate-900 ring-1 ring-slate-700" : "hover:bg-slate-900/60"
                    }`}
                  >
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${style.text} ${style.bg}`}
                    >
                      {mock.method}
                    </span>
                    <span className="truncate font-mono text-[12.5px] text-slate-300">{mock.path}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(mock.id);
                    }}
                    aria-label={`Delete mock ${mock.path}`}
                    className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-red-400 group-hover:block"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-800 px-3 py-3">
        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200">
          <CreditCard className="h-4 w-4" />
          Billing
        </button>
        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------
 * EmptyState.jsx
 * ---------------------------------------------------------------------- */
function EmptyState({ onCreate }) {
  const steps = ["Define path", "Paste JSON", "Deploy live URL"];
  return (
    <div className="flex h-full flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/40 px-8 py-10 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600/15">
          <Terminal className="h-5 w-5 text-indigo-400" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-white">Stop waiting for the backend.</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">
          Spin up a hosted mock endpoint in seconds. No server, no deploy, just a live URL your
          frontend can call right now.
        </p>

        <button
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Create your first mock endpoint
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11.5px] font-mono text-slate-500">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <span className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1 text-slate-400">
                {step}
              </span>
              {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-700" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * ResponseEditor.jsx — JSON code editor with line numbers + validation
 * ---------------------------------------------------------------------- */
function ResponseEditor({ value, onChange }) {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const { isValid, error } = useMemo(() => {
    if (value.trim() === "") return { isValid: true, error: null };
    try {
      JSON.parse(value);
      return { isValid: true, error: null };
    } catch (e) {
      return { isValid: false, error: e.message };
    }
  }, [value]);

  const lineCount = value.split("\n").length;

  const syncScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(value), null, 2);
      onChange(formatted);
    } catch {
      /* invalid JSON — leave as-is, error message already shown below */
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-slate-800 bg-slate-900 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 font-mono text-[11.5px] text-slate-500">response.json</span>
        </div>
        <button
          onClick={handleFormat}
          className="flex items-center gap-1.5 rounded-md border border-slate-700 px-2 py-1 text-[11.5px] font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800"
        >
          <Wand2 className="h-3 w-3" />
          Format JSON
        </button>
      </div>

      <div className="flex overflow-hidden rounded-b-lg border border-slate-800 bg-slate-950">
        <div
          ref={gutterRef}
          className="select-none overflow-hidden px-3 py-3 text-right font-mono text-[13px] leading-6 text-slate-700"
          style={{ minWidth: "2.75rem" }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          spellCheck={false}
          rows={10}
          className="w-full resize-none bg-transparent py-3 pr-3 font-mono text-[13px] leading-6 text-emerald-300 outline-none placeholder:text-slate-700"
          placeholder='{\n  "key": "value"\n}'
        />
      </div>

      {!isValid && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Invalid JSON — {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * MockForm.jsx
 * ---------------------------------------------------------------------- */
function MockForm({ mock, onUpdate }) {
  const style = methodStyle(mock.method);

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-slate-400">Method and path</label>
        <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-800 bg-slate-900 focus-within:ring-1 focus-within:ring-indigo-500">
          <div className="relative">
            <select
              value={mock.method}
              onChange={(e) => onUpdate({ method: e.target.value })}
              className={`h-full appearance-none border-r border-slate-800 bg-transparent py-2.5 pl-3 pr-8 text-[13px] font-bold outline-none ${style.text}`}
            >
              {METHODS.map((m) => (
                <option key={m.value} value={m.value} className="bg-slate-900 text-slate-100">
                  {m.value}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          </div>
          <span className="flex items-center bg-slate-900 pl-3 font-mono text-[13px] text-slate-600">
            {BASE_HOST}/{mock.shortId}
          </span>
          <input
            value={mock.path}
            onChange={(e) => onUpdate({ path: e.target.value })}
            placeholder="/api/v1/users"
            className="flex-1 bg-transparent py-2.5 pl-1 pr-3 font-mono text-[13px] text-white outline-none placeholder:text-slate-600"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-slate-400">Response status code</label>
        <div className="relative w-64">
          <select
            value={mock.status}
            onChange={(e) => onUpdate({ status: Number(e.target.value) })}
            className="w-full appearance-none rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-3 pr-9 text-[13px] font-medium text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {STATUS_CODES.map((s) => (
              <option key={s.value} value={s.value} className="bg-slate-900">
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-slate-400">JSON response body</label>
        <ResponseEditor value={mock.body} onChange={(body) => onUpdate({ body })} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * TerminalPreview.jsx — "Send Test Request" simulator
 * ---------------------------------------------------------------------- */
function TerminalPreview({ mock, liveUrl }) {
  const [state, setState] = useState("idle"); // idle | loading | done
  const style = methodStyle(mock.method);

  const send = () => {
    setState("loading");
    setTimeout(() => setState("done"), 650);
  };

  useEffect(() => {
    setState("idle");
  }, [mock.id]);

  const isValidBody = useMemo(() => {
    try {
      JSON.parse(mock.body || "{}");
      return true;
    } catch {
      return false;
    }
  }, [mock.body]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-slate-400">Test response</span>
        <button
          onClick={send}
          disabled={state === "loading"}
          className="flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1.5 text-[12px] font-medium text-slate-200 transition-colors hover:bg-slate-700 disabled:opacity-60"
        >
          <Play className="h-3 w-3" />
          {state === "loading" ? "Sending..." : "Send test request"}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-black">
        <div className="absolute right-3 top-3 rotate-6 select-none rounded border border-dashed border-amber-500/50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-amber-500/70">
          MOCKED
        </div>

        <div className="max-h-64 overflow-y-auto p-4 font-mono text-[12.5px] leading-6">
          {state === "idle" && (
            <p className="text-slate-600">
              $ waiting to send request
              <span className="ml-0.5 animate-pulse">▍</span>
            </p>
          )}

          {state === "loading" && <p className="text-slate-500">$ connecting to {liveUrl}...</p>}

          {state === "done" && (
            <div>
              <p className="text-slate-500">$ curl -i {liveUrl}</p>
              <p className="mt-2">
                <span className={style.text}>HTTP/1.1 {mock.status}</span>
                <span className="text-slate-500"> {statusText(mock.status)}</span>
              </p>
              <p className="text-slate-500">content-type: application/json</p>
              <p className="text-slate-500">x-mockless-id: {mock.shortId}</p>
              <pre className="mt-2 whitespace-pre-wrap text-slate-200">
                {isValidBody ? mock.body : "{}"}
              </pre>
              <p className="mt-2 text-slate-600">
                $<span className="ml-0.5 animate-pulse">▍</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function statusText(code) {
  const map = { 200: "OK", 201: "Created", 400: "Bad Request", 404: "Not Found", 500: "Internal Server Error" };
  return map[code] || "";
}

/* -------------------------------------------------------------------------
 * LiveDeploymentPanel.jsx
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
      className="relative flex shrink-0 items-center gap-1.5 rounded-md border border-slate-700 px-2 py-1.5 text-[12px] font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function LiveDeploymentPanel({ mock }) {
  const liveUrl = `https://${BASE_HOST}/${mock.shortId}${mock.path}`;
  const curl = `curl -i -X ${mock.method} \\\n  ${liveUrl}`;

  return (
    <div className="flex h-full w-96 shrink-0 flex-col gap-6 overflow-y-auto border-l border-slate-800 bg-slate-950 p-5">
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[12.5px] font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live endpoint
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 py-1.5 pl-3 pr-1.5">
          <span className="flex-1 truncate font-mono text-[12.5px] text-slate-200">{liveUrl}</span>
          <CopyButton text={liveUrl} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[12.5px] font-medium text-slate-400">cURL snippet</p>
        <div className="rounded-lg border border-slate-800 bg-slate-900">
          <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-slate-300">{curl}</pre>
          <div className="flex justify-end border-t border-slate-800 px-2 py-1.5">
            <CopyButton text={curl} />
          </div>
        </div>
      </div>

      <TerminalPreview mock={mock} liveUrl={liveUrl} />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * App.jsx — top-level assembly
 * ---------------------------------------------------------------------- */
export default function App() {
  const [mocks, setMocks] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const active = mocks.find((m) => m.id === activeId) || null;

  const createMock = () => {
    const mock = makeMock(mocks.length);
    setMocks((prev) => [mock, ...prev]);
    setActiveId(mock.id);
  };

  const updateMock = (id, patch) => {
    setMocks((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const deleteMock = (id) => {
    setMocks((prev) => prev.filter((m) => m.id !== id));
    if (activeId === id) {
      const remaining = mocks.filter((m) => m.id !== id);
      setActiveId(remaining[0]?.id ?? null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 antialiased">
      <Sidebar
        mocks={mocks}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createMock}
        onDelete={deleteMock}
      />

      {!active ? (
        <EmptyState onCreate={createMock} />
      ) : (
        <>
          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold tracking-tight text-white">Configure endpoint</h1>
                  <p className="mt-0.5 text-[13px] text-slate-500">
                    Changes to the path, status, and body update the live URL instantly.
                  </p>
                </div>
                <button
                  onClick={() => deleteMock(active.id)}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                  Delete mock
                </button>
              </div>

              <MockForm mock={active} onUpdate={(patch) => updateMock(active.id, patch)} />
            </div>
          </main>

          <LiveDeploymentPanel mock={active} />
        </>
      )}
    </div>
  );
}
