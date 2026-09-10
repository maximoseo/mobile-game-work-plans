import { useState, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

/**
 * Password field with an accessible show/hide toggle.
 *
 * The toggle is a real `<button type="button">` so it can never submit the
 * form, and it reports its state through `aria-pressed` and a label that flips
 * between "Show password" and "Hide password".
 */
export function PasswordInput({ style, ...props }: Props) {
  const [show, setShow] = useState(false);
  const label = show ? "Hide password" : "Show password";

  return (
    <div style={{ position: "relative", display: "block" }}>
      <input
        {...props}
        type={show ? "text" : "password"}
        style={{ ...style, paddingInlineEnd: "2.5rem", width: "100%", boxSizing: "border-box" }}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={label}
        aria-pressed={show}
        title={label}
        style={{
          position: "absolute",
          insetInlineEnd: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: 0,
          padding: 4,
          margin: 0,
          cursor: "pointer",
          color: "inherit",
          opacity: 0.7,
          lineHeight: 0,
        }}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.4 0 10 7 10 7a17.6 17.6 0 0 1-2.2 3.15M6.6 6.6A17.6 17.6 0 0 0 2 11s3.6 7 10 7a9.1 9.1 0 0 0 4.2-1M3 3l18 18" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
