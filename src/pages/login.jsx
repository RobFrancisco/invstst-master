import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';

const AUTH_STORAGE_KEY = 'inventory-user';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@inventory.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { user } = await apiClient.auth.login({ email, password });
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      const next = typeof router.query.next === 'string' ? router.query.next : '/';
      router.replace(next);
      toast({ title: 'Welcome back', description: 'You have been signed in successfully.' });
    } catch (error) {
      toast({ title: 'Login failed', description: error.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.15),_transparent_55%)] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-border/70 shadow-xl">
        <CardHeader className="space-y-2">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 p-2">
            <img src="/gpp.png" alt="GPP logo" className="h-full w-full object-contain" />
          </div>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Use your inventory account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Demo accounts</p>
            <ul className="mt-2 space-y-1">
              <li><span className="font-medium text-foreground">Admin:</span> admin@inventory.com / admin123</li>
              <li><span className="font-medium text-foreground">Manager:</span> manager@inventory.com / manager123</li>
              <li><span className="font-medium text-foreground">Staff:</span> staff@inventory.com / staff123</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
