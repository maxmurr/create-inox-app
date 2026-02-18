"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100dvh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Something went wrong</h2>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: "#171717",
              color: "#fafafa",
              fontSize: "0.875rem",
              cursor: "pointer",
              border: "none",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
