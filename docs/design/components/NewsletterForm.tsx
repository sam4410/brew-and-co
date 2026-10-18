import { useId } from "react";
import { Button } from "./Button";

/**
 * Email sign-up. Pass a Server Action as `action`.
 * Visible label (never placeholder-only); error text is tied to the input via aria-describedby.
 */
export function NewsletterForm({
  action,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
}) {
  const id = useId();
  return (
    <form action={action} className="flex max-w-md flex-col gap-2">
      <label htmlFor={id} className="font-semibold">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-11 min-w-0 flex-1 rounded-control border border-roast bg-white px-3 text-body placeholder:text-roast-soft aria-invalid:border-error"
          placeholder="you@example.com"
        />
        <Button type="submit">Subscribe</Button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-caption text-error">
          {error}
        </p>
      )}
    </form>
  );
}
