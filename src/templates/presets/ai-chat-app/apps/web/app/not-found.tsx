import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Go home
      </Link>
    </div>
  );
}
