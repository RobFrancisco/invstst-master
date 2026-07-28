import { useRouter } from 'next/router';

export default function CatchAllPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-6">The page "{router.asPath}" doesn't exist.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}