"use client";

import { useActionState, useId, useRef, useState, type ComponentProps } from "react";
import { Button } from "./Button";

type State = {
  ok?: boolean;
  summary?: string;
  errors?: Partial<Record<"name" | "party" | "date" | "time", string>>;
  values?: Record<string, string>;
};
type Action = (prev: State, formData: FormData) => Promise<State>;

const input =
  "h-11 w-full rounded-control border border-roast bg-white px-3 text-body aria-invalid:border-error";

/**
 * "Reserve a table" button that opens a modal form in a native <dialog>
 * (showModal gives focus trapping, Esc to close and focus return for free).
 * Pass a Server Action as `action`; it must validate again on the server.
 */
export function ReserveDialog({
  action,
  variant = "primary",
  size,
  className = "",
  note,
}: {
  action: Action;
  note?: string; // e.g. opening hours, shown under the fields
  variant?: "primary" | "secondary" | "on-roast";
  size?: "md" | "lg";
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(0); // remounts the form so each open starts fresh
  const [today, setToday] = useState("");
  const titleId = useId();

  function open() {
    const d = new Date();
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    setOpened((n) => n + 1);
    ref.current?.showModal();
  }

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={open} aria-haspopup="dialog">
        Reserve a table
      </Button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        className="m-auto w-[min(100%-2rem,28rem)] bg-plaster p-6 text-roast shadow-float backdrop:bg-roast/60 md:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-h3">
            Reserve a table
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="grid size-11 shrink-0 place-items-center rounded-control border border-roast text-h4 transition-colors duration-(--duration-quick) hover:bg-roast hover:text-chalk"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        {opened > 0 && <ReserveForm key={opened} action={action} today={today} note={note} />}
      </dialog>
    </>
  );
}

function ReserveForm({ action, today, note }: { action: Action; today: string; note?: string }) {
  const [state, formAction, pending] = useActionState(action, {});
  const id = useId();

  if (state.ok) {
    return (
      <p role="status" className="text-lead">
        {state.summary}
      </p>
    );
  }

  const field = (name: "name" | "party" | "date" | "time", label: string, props: ComponentProps<"input">) => {
    const error = state.errors?.[name];
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-${name}`} className="font-semibold">
          {label}
        </label>
        <input
          id={`${id}-${name}`}
          name={name}
          required
          defaultValue={state.values?.[name]}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-${name}-error` : undefined}
          className={input}
          {...props}
        />
        {error && (
          <p id={`${id}-${name}-error`} className="text-caption text-error">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {field("name", "Name", { type: "text", autoComplete: "name", maxLength: 80 })}
      {field("party", "Party size", { type: "number", min: 1, max: 12, inputMode: "numeric" })}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("date", "Date", { type: "date", min: today })}
        {field("time", "Time", { type: "time", min: "07:00", max: "21:00", step: 900 })}
      </div>
      {note && <p className="text-caption text-roast-soft">{note}</p>}
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Requesting…" : "Request table"}
      </Button>
    </form>
  );
}
