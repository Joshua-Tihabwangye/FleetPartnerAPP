import React from "react";

type PageStateKind = "loading" | "error" | "empty";

export default function PageState({
  kind,
  title,
  message,
  actionLabel,
  onAction,
}: {
  kind: PageStateKind;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const tone =
    kind === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : kind === "empty"
        ? "border-slate-200 bg-white text-slate-700"
        : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={`rounded-xl border p-8 text-center ${tone}`}>
      {kind === "loading" ? <div className="text-2xl mb-3">⏳</div> : null}
      {kind === "empty" ? <div className="text-3xl mb-3">📭</div> : null}
      {kind === "error" ? <div className="text-3xl mb-3">⚠️</div> : null}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {message ? <p className="text-sm text-slate-600 mb-4">{message}</p> : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
