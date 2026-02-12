"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LogPayload = {
  lines: string[];
  lineCount: number;
  requestedLines: number;
  path: string;
  updatedAt: string | null;
  message?: string;
};

const REFRESH_MS = 2000;
const LINE_OPTIONS = [100, 200, 500, 1000];

export default function LogsPage() {
  const [lines, setLines] = useState<string[]>([]);
  const [requestedLines, setRequestedLines] = useState(200);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/logs/tail?lines=${requestedLines}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load logs.");
      }
      const data: LogPayload = await response.json();
      setLines(Array.isArray(data.lines) ? data.lines : []);
      setUpdatedAt(data.updatedAt ?? null);
      setError(data.message ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load logs.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [requestedLines]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(fetchLogs, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchLogs, paused]);

  useEffect(() => {
    if (!autoScroll || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, autoScroll]);

  const filteredLines = query
    ? lines.filter((line) => line.toLowerCase().includes(query.toLowerCase()))
    : lines;

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-semibold text-[color:var(--brand)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Server Logs
              </h1>
              <p className="mt-2 text-sm text-[color:var(--muted-text)]">
                Updates every {REFRESH_MS / 1000}s. Source: storage/logs/laravel.log
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted-text)]">
              <span className="rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-1">
                {updatedAt ? `Updated: ${new Date(updatedAt).toLocaleTimeString()}` : "No data"}
              </span>
              <span className="rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-1">
                {loading ? "Refreshing..." : paused ? "Paused" : "Live"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="text-xs text-[color:var(--muted-text)]">Lines</label>
            <div className="flex items-center gap-2">
              {LINE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRequestedLines(option)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    option === requestedLines
                      ? "bg-[color:var(--accent-strong)] text-white"
                      : "border border-[color:var(--surface-muted)] bg-[color:var(--card)] text-[color:var(--muted-text)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter text..."
                className="w-44 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-4 py-2 text-xs text-[color:var(--foreground)]"
              />
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                className="rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-4 py-2 text-xs text-[color:var(--foreground)]"
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={() => setAutoScroll((value) => !value)}
                className={`rounded-full px-4 py-2 text-xs ${
                  autoScroll
                    ? "bg-[color:var(--accent-strong)] text-white"
                    : "border border-[color:var(--surface-muted)] bg-[color:var(--card)] text-[color:var(--foreground)]"
                }`}
              >
                {autoScroll ? "Auto-scroll on" : "Auto-scroll off"}
              </button>
              <button
                type="button"
                onClick={fetchLogs}
                className="rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-4 py-2 text-xs text-[color:var(--foreground)]"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-4 shadow-[0_24px_60px_rgba(19,13,8,0.16)]">
          {error ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--accent-strong)] bg-white/60 px-4 py-6 text-sm text-[color:var(--accent-strong)]">
              {error}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="h-[65vh] overflow-auto rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-4 text-xs leading-6 text-[color:var(--foreground)]"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
            >
              {filteredLines.length === 0 ? (
                <div className="text-[color:var(--muted-text)]">No logs yet.</div>
              ) : (
                filteredLines.map((line, index) => (
                  <div key={`${index}-${line.slice(0, 24)}`} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
