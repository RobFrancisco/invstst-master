import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="max-w-lg w-full rounded-3xl border border-border bg-card p-10 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-4 text-4xl font-bold text-foreground">Page not found</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          The page you are looking for does not exist or has been moved. Use the link below to return to the dashboard.
        </p>
        <Link href="/" className="inline-flex mt-8 items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          Go back home
        </Link>
      </div>
    </div>
  );
}
