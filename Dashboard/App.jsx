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
  ChevronRight,
  AlertCircle,
  CreditCard,
  BookOpen,
  Menu,
  PanelLeftClose,
  PanelLeft,
  FolderPlus,
  Table2,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------
 * Mockless — Dashboard
 *
 * Redesign notes (see optimized_prompt.md for the full brief):
 *   - Dark theme, obsidian background / electric-orange accent, tokens live
 *     as CSS variables in index.css (--bg, --surface, --accent, ...).
 *   - Single sidebar: global routes only (Projects, Documentation, Billing,
 *     Settings). The "Mock APIs" list now lives in the main viewport as a
 *     workspace table, scoped to the active project.
 *   - Onboarding: creating the first endpoint prompts for a Project Name
 *     before any mock config happens.
 *   - Breadcrumb: "{Project Name} / Mock" sits above the main viewport.
 *   - Core logic (mock shape, JSON validation, curl/test simulation) is
 *     unchanged from the original — only presentation and information
 *     architecture moved.
 *
 * Split into separate files 1:1 if wiring into the real project:
 *   Sidebar.jsx · CreateProjectModal.jsx · Breadcrumb.jsx ·
 *   ProjectWorkspace.jsx (Mock APIs table) · MockForm.jsx ·
 *   ResponseEditor.jsx · TerminalPreview.jsx · LiveDeploymentPanel.jsx
 * ---------------------------------------------------------------------- */

const METHODS = [
  { value: "GET", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { value: "POST", text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30" },
  { value: "PUT", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { value: "DELETE", text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" },
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

function makeMock() {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `mock-${Date.now()}-${Math.random()}`,
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

function makeProject(name) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `project-${Date.now()}-${Math.random()}`,
    name,
    mocks: [],
  };
}

function statusText(code) {
  const map = { 200: "OK", 201: "Created", 400: "Bad Request", 404: "Not Found", 500: "Internal Server Error" };
  return map[code] || "";
}

/* -------------------------------------------------------------------------
 * Sidebar.jsx — global routes only. No per-endpoint data lives here.
 * ---------------------------------------------------------------------- */
function Sidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}) {
  const navItems = [
    { icon: BookOpen, label: "Documentation" },
    { icon: CreditCard, label: "Billing" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg)] transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[68px]" : "lg:w-64"} w-64`}
      >
        <div className={`flex items-center gap-2 px-4 py-5 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--accent)]">
            <Terminal className="h-4 w-4 text-black" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-[15px] font-semibold tracking-tight text-white">Mockless</span>
          )}
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="ml-auto rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className={`px-3 ${collapsed ? "lg:px-2" : ""}`}>
          <button
            onClick={onNewProject}
            title="New project"
            className={`flex w-full items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] ${
              collapsed ? "lg:justify-center lg:px-0" : "justify-center"
            }`}
          >
            <FolderPlus className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            {!collapsed && <span className="lg:hidden xl:inline">New project</span>}
            {!collapsed && <span className="hidden lg:inline xl:hidden">New</span>}
          </button>
        </div>

        <div className="mockless-scroll mt-6 flex-1 overflow-y-auto px-3">
          {!collapsed && (
            <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--text-faint)]">
              Projects — {projects.length}
            </p>
          )}

          {projects.length === 0 ? (
            !collapsed && (
              <p className="px-2 py-3 text-[13px] leading-relaxed text-[var(--text-faint)]">
                No projects yet. Create one to start mocking endpoints.
              </p>
            )
          ) : (
            <ul className="space-y-1">
              {projects.map((project) => {
                const isActive = project.id === activeProjectId;
                return (
                  <li key={project.id}>
                    <button
                      onClick={() => onSelectProject(project.id)}
                      title={project.name}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors ${
                        isActive
                          ? "bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]/40"
                          : "hover:bg-[var(--surface-hover)]"
                      } ${collapsed ? "lg:justify-center" : ""}`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold uppercase ${
                          isActive
                            ? "bg-[var(--accent)] text-black"
                            : "bg-[var(--surface-raised)] text-[var(--text-muted)]"
                        }`}
                      >
                        {project.name.slice(0, 1)}
                      </span>
                      {!collapsed && (
                        <span
                          className={`truncate text-[13px] ${
                            isActive ? "font-medium text-white" : "text-[var(--text-muted)]"
                          }`}
                        >
                          {project.name}
                        </span>
                      )}
                      {!collapsed && (
                        <span className="ml-auto shrink-0 text-[11px] text-[var(--text-faint)]">
                          {project.mocks.length}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-[var(--border)] px-3 py-3">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-white ${
                collapsed ? "lg:justify-center" : ""
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}

          <button
            onClick={onToggleCollapsed}
            className={`mt-1 hidden w-full items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[var(--text-faint)] transition-colors hover:bg-[var(--surface-hover)] hover:text-white lg:flex ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            {collapsed ? <PanelLeft className="h-4 w-4 shrink-0" /> : <PanelLeftClose className="h-4 w-4 shrink-0" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

/* -------------------------------------------------------------------------
 * CreateProjectModal.jsx — onboarding gate before any mock config happens
 * ---------------------------------------------------------------------- */
function CreateProjectModal({ isFirst, onCreate, onClose }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give your project a name to continue.");
      return;
    }
    onCreate(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
          <FolderPlus className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <h2 className="text-[16px] font-semibold tracking-tight text-white">
          {isFirst ? "Name your first project" : "Create a new project"}
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-muted)]">
          Endpoints live inside a project, so every mock URL is grouped and easy to find later.
        </p>

        <form onSubmit={submit} className="mt-4">
          <label className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-muted)]">
            Project name
          </label>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="Brand Strategy"
            className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg)] px-3 py-2.5 text-[13.5px] text-white outline-none placeholder:text-[var(--text-faint)] focus:ring-1 focus:ring-[var(--accent)]"
          />
          {error && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-rose-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="mt-5 flex items-center justify-end gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-white"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-[var(--accent-hover)]"
            >
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * EmptyState.jsx — shown before any project exists
 * ---------------------------------------------------------------------- */
function EmptyState({ onCreate, onOpenMenu }) {
  const steps = ["Name project", "Define path", "Deploy live URL"];
  return (
    <div className="flex h-full flex-1 flex-col">
      <MobileTopBar onOpenMenu={onOpenMenu} />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] px-8 py-10 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
            <Terminal className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Stop waiting for the backend.</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
            Spin up a hosted mock endpoint in seconds. No server, no deploy, just a live URL your
            frontend can call right now.
          </p>

          <button
            onClick={onCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Create first endpoint
          </button>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11.5px] font-mono text-[var(--text-faint)]">
            {steps.map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-[var(--text-muted)]">
                  {step}
                </span>
                {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[var(--text-faint)]" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * MobileTopBar.jsx — hamburger + brand, <lg only
 * ---------------------------------------------------------------------- */
function MobileTopBar({ onOpenMenu }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)] px-4 py-3 lg:hidden">
      <button
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)]">
          <Terminal className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
        </div>
        <span className="text-[14px] font-semibold tracking-tight text-white">Mockless</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Breadcrumb.jsx — "{Project Name} / Mock", with project switcher
 * ---------------------------------------------------------------------- */
function Breadcrumb({ projects, activeProject, onSelectProject, onNewProject, trailing }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3 lg:px-8">
      <div className="relative flex min-w-0 items-center gap-1.5" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-medium text-white transition-colors hover:bg-[var(--surface-hover)]"
        >
          <span className="truncate">{activeProject.name}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
        </button>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-faint)]" />
        <span className="text-[13px] text-[var(--text-muted)]">Mock</span>

        {open && (
          <div className="absolute left-0 top-full z-30 mt-1.5 w-56 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-xl">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProject(p.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors hover:bg-[var(--surface-hover)] ${
                  p.id === activeProject.id ? "text-[var(--accent)]" : "text-slate-200"
                }`}
              >
                <span className="truncate">{p.name}</span>
                <span className="ml-2 shrink-0 text-[11px] text-[var(--text-faint)]">{p.mocks.length}</span>
              </button>
            ))}
            <div className="my-1 border-t border-[var(--border)]" />
            <button
              onClick={() => {
                setOpen(false);
                onNewProject();
              }}
              className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[13px] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--surface-hover)]"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              New project
            </button>
          </div>
        )}
      </div>

      {trailing}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * ProjectWorkspace.jsx — the "Mock APIs" table, embedded in the main
 * viewport (this replaces the old dual-sidebar mocks list entirely).
 * ---------------------------------------------------------------------- */
function ProjectWorkspace({ project, onSelectMock, onCreateMock, onDeleteMock }) {
  return (
    <div className="mx-auto w-full max-w-4xl p-5 lg:p-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
            <Table2 className="h-4.5 w-4.5 text-[var(--accent)]" />
            Mock APIs
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
            Every endpoint hosted under <span className="font-mono text-slate-300">{project.name}</span>.
          </p>
        </div>
        <button
          onClick={onCreateMock}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-[13px] font-medium text-black transition-colors hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          New endpoint
        </button>
      </div>

      {project.mocks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)]/40 px-6 py-14 text-center">
          <p className="text-[13.5px] text-[var(--text-muted)]">
            No endpoints in this project yet.
          </p>
          <button
            onClick={onCreateMock}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-3 py-2 text-[13px] font-medium text-slate-200 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first endpoint
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--text-faint)]">
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Path</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Live URL</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {project.mocks.map((mock) => {
                const style = methodStyle(mock.method);
                const liveUrl = `${BASE_HOST}/${mock.shortId}${mock.path}`;
                return (
                  <tr
                    key={mock.id}
                    onClick={() => onSelectMock(mock.id)}
                    className="cursor-pointer border-b border-[var(--border)] transition-colors last:border-b-0 hover:bg-[var(--surface-hover)]"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide ${style.text} ${style.bg}`}
                      >
                        {mock.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12.5px] text-slate-200">{mock.path}</td>
                    <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">{mock.status}</td>
                    <td className="hidden max-w-[220px] truncate px-4 py-3 font-mono text-[12px] text-[var(--text-faint)] md:table-cell">
                      {liveUrl}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMock(mock.id);
                        }}
                        aria-label={`Delete mock ${mock.path}`}
                        className="rounded-md p-1.5 text-[var(--text-faint)] transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-[var(--border)] bg-[var(--surface)] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 font-mono text-[11.5px] text-[var(--text-faint)]">response.json</span>
        </div>
        <button
          onClick={handleFormat}
          className="flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-2 py-1 text-[11.5px] font-medium text-slate-300 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <Wand2 className="h-3 w-3" />
          Format JSON
        </button>
      </div>

      <div className="flex overflow-hidden rounded-b-lg border border-[var(--border)] bg-[var(--bg)]">
        <div
          ref={gutterRef}
          className="mockless-scroll select-none overflow-hidden px-3 py-3 text-right font-mono text-[13px] leading-6 text-[var(--text-faint)]"
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
          className="mockless-scroll w-full resize-none bg-transparent py-3 pr-3 font-mono text-[13px] leading-6 text-emerald-300 outline-none placeholder:text-[var(--text-faint)]"
          placeholder='{\n  "key": "value"\n}'
        />
      </div>

      {!isValid && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-rose-400">
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
        <label className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-muted)]">Method and path</label>
        <div className="flex items-stretch overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] focus-within:ring-1 focus-within:ring-[var(--accent)]">
          <div className="relative">
            <select
              value={mock.method}
              onChange={(e) => onUpdate({ method: e.target.value })}
              className={`h-full appearance-none border-r border-[var(--border)] bg-transparent py-2.5 pl-3 pr-8 text-[13px] font-bold outline-none ${style.text}`}
            >
              {METHODS.map((m) => (
                <option key={m.value} value={m.value} className="bg-[var(--surface)] text-slate-100">
                  {m.value}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          </div>
          <span className="hidden items-center bg-[var(--surface)] pl-3 font-mono text-[13px] text-[var(--text-faint)] sm:flex">
            {BASE_HOST}/{mock.shortId}
          </span>
          <input
            value={mock.path}
            onChange={(e) => onUpdate({ path: e.target.value })}
            placeholder="/api/v1/users"
            className="flex-1 bg-transparent py-2.5 pl-3 pr-3 font-mono text-[13px] text-white outline-none placeholder:text-[var(--text-faint)] sm:pl-1"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-muted)]">Response status code</label>
        <div className="relative w-full sm:w-64">
          <select
            value={mock.status}
            onChange={(e) => onUpdate({ status: Number(e.target.value) })}
            className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-3 pr-9 text-[13px] font-medium text-slate-200 outline-none focus:ring-1 focus:ring-[var(--accent)]"
          >
            {STATUS_CODES.map((s) => (
              <option key={s.value} value={s.value} className="bg-[var(--surface)]">
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-muted)]">JSON response body</label>
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
        <span className="text-[12.5px] font-medium text-[var(--text-muted)]">Test response</span>
        <button
          onClick={send}
          disabled={state === "loading"}
          className="flex items-center gap-1.5 rounded-md bg-[var(--surface-raised)] px-2.5 py-1.5 text-[12px] font-medium text-slate-200 transition-colors hover:bg-[var(--surface-hover)] disabled:opacity-60"
        >
          <Play className="h-3 w-3" />
          {state === "loading" ? "Sending..." : "Send test request"}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-black">
        <div className="absolute right-3 top-3 rotate-6 select-none rounded border border-dashed border-[var(--accent)]/50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[var(--accent)]/70">
          MOCKED
        </div>

        <div className="mockless-scroll max-h-64 overflow-y-auto p-4 font-mono text-[12.5px] leading-6">
          {state === "idle" && (
            <p className="text-[var(--text-faint)]">
              $ waiting to send request
              <span className="ml-0.5 animate-pulse">▍</span>
            </p>
          )}

          {state === "loading" && <p className="text-[var(--text-muted)]">$ connecting to {liveUrl}...</p>}

          {state === "done" && (
            <div>
              <p className="text-[var(--text-muted)]">$ curl -i {liveUrl}</p>
              <p className="mt-2">
                <span className={style.text}>HTTP/1.1 {mock.status}</span>
                <span className="text-[var(--text-muted)]"> {statusText(mock.status)}</span>
              </p>
              <p className="text-[var(--text-muted)]">content-type: application/json</p>
              <p className="text-[var(--text-muted)]">x-mockless-id: {mock.shortId}</p>
              <pre className="mt-2 whitespace-pre-wrap text-slate-200">
                {isValidBody ? mock.body : "{}"}
              </pre>
              <p className="mt-2 text-[var(--text-faint)]">
                $<span className="ml-0.5 animate-pulse">▍</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
      className="relative flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-2 py-1.5 text-[12px] font-medium text-slate-300 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
    <div className="mockless-scroll flex w-full shrink-0 flex-col gap-6 overflow-y-auto border-t border-[var(--border)] bg-[var(--bg)] p-5 lg:w-96 lg:border-l lg:border-t-0">
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--text-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live endpoint
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-3 pr-1.5">
          <span className="flex-1 truncate font-mono text-[12.5px] text-slate-200">{liveUrl}</span>
          <CopyButton text={liveUrl} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[12.5px] font-medium text-[var(--text-muted)]">cURL snippet</p>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <pre className="mockless-scroll overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-slate-300">{curl}</pre>
          <div className="flex justify-end border-t border-[var(--border)] px-2 py-1.5">
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
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeMockId, setActiveMockId] = useState(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;
  const activeMock = activeProject?.mocks.find((m) => m.id === activeMockId) || null;

  const isFirstProject = projects.length === 0;

  const openCreateProjectModal = () => setShowProjectModal(true);

  const createProject = (name) => {
    const project = makeProject(name);
    const firstMock = makeMock();
    project.mocks = [firstMock];

    setProjects((prev) => [project, ...prev]);
    setActiveProjectId(project.id);
    setActiveMockId(firstMock.id);
    setShowProjectModal(false);
    setMobileNavOpen(false);
  };

  const selectProject = (id) => {
    setActiveProjectId(id);
    setActiveMockId(null);
    setMobileNavOpen(false);
  };

  const createMock = () => {
    if (!activeProject) return;
    const mock = makeMock();
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProject.id ? { ...p, mocks: [mock, ...p.mocks] } : p))
    );
    setActiveMockId(mock.id);
  };

  const updateMock = (id, patch) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== activeProject.id
          ? p
          : { ...p, mocks: p.mocks.map((m) => (m.id === id ? { ...m, ...patch } : m)) }
      )
    );
  };

  const deleteMock = (id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id !== activeProject.id ? p : { ...p, mocks: p.mocks.filter((m) => m.id !== id) }))
    );
    if (activeMockId === id) setActiveMockId(null);
  };

  return (
    <div className="flex h-screen w-full bg-[var(--bg)] text-slate-100 antialiased">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={selectProject}
        onNewProject={openCreateProjectModal}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {!activeProject ? (
          <EmptyState onCreate={openCreateProjectModal} onOpenMenu={() => setMobileNavOpen(true)} />
        ) : (
          <>
            <MobileTopBar onOpenMenu={() => setMobileNavOpen(true)} />

            <Breadcrumb
              projects={projects}
              activeProject={activeProject}
              onSelectProject={selectProject}
              onNewProject={openCreateProjectModal}
              trailing={
                activeMock ? (
                  <button
                    onClick={() => setActiveMockId(null)}
                    className="shrink-0 rounded-md px-2 py-1 text-[12.5px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-white"
                  >
                    ← Back to project
                  </button>
                ) : null
              }
            />

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
              {!activeMock ? (
                <div className="mockless-scroll flex-1 overflow-y-auto">
                  <ProjectWorkspace
                    project={activeProject}
                    onSelectMock={setActiveMockId}
                    onCreateMock={createMock}
                    onDeleteMock={deleteMock}
                  />
                </div>
              ) : (
                <>
                  <main className="mockless-scroll flex-1 overflow-y-auto p-5 lg:p-8">
                    <div className="mx-auto max-w-2xl">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <h1 className="text-lg font-semibold tracking-tight text-white">Configure endpoint</h1>
                          <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                            Changes to the path, status, and body update the live URL instantly.
                          </p>
                        </div>
                        <button
                          onClick={() => deleteMock(activeMock.id)}
                          className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-[var(--text-faint)] transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                        >
                          <X className="h-3.5 w-3.5" />
                          Delete mock
                        </button>
                      </div>

                      <MockForm mock={activeMock} onUpdate={(patch) => updateMock(activeMock.id, patch)} />
                    </div>
                  </main>

                  <LiveDeploymentPanel mock={activeMock} />
                </>
              )}
            </div>
          </>
        )}
      </div>

      {showProjectModal && (
        <CreateProjectModal
          isFirst={isFirstProject}
          onCreate={createProject}
          onClose={() => setShowProjectModal(false)}
        />
      )}
    </div>
  );
}
