import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';

const AUTH_STORAGE_KEY = 'inventory-user';

const emptyForm = {
  full_name: '',
  email: '',
  password: '',
  role: 'staff',
  status: 'active',
};

export default function UserManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let active = true;
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    setCurrentUser(currentUser);

    if (currentUser && currentUser.role !== 'admin') {
      router.replace('/');
      return;
    }

    apiClient.users.list().then((items) => {
      if (!active) return;
      setUsers(items);
    }).catch(() => {
      if (active) setUsers([]);
    });

    return () => {
      active = false;
    };
  }, [router]);

  const canManage = useMemo(() => currentUser?.role === 'admin', [currentUser]);

  if (!canManage) return null;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (editingId) {
        const updated = await apiClient.users.update(editingId, {
          full_name: form.full_name,
          email: form.email,
          role: form.role,
          status: form.status,
          ...(form.password ? { password: form.password } : {}),
        });
        setUsers((prev) => prev.map((user) => (user.id === editingId ? updated : user)));
        toast({ title: 'User updated', description: `${updated.full_name} was updated successfully.` });
      } else {
        const created = await apiClient.users.create({
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role: form.role,
          status: form.status,
        });
        setUsers((prev) => [created, ...prev]);
        toast({ title: 'User created', description: `${created.full_name} was added successfully.` });
      }
      resetForm();
    } catch (error) {
      toast({ title: 'Unable to save user', description: error.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
  };

  const handleToggleStatus = async (user) => {
    try {
      const nextStatus = user.status === 'active' ? 'inactive' : 'active';
      const updated = await apiClient.users.update(user.id, { status: nextStatus });
      setUsers((prev) => prev.map((item) => (item.id === user.id ? updated : item)));
      toast({ title: 'Status updated', description: `${updated.full_name} is now ${updated.status}.` });
    } catch (error) {
      toast({ title: 'Update failed', description: error.message || 'Please try again.', variant: 'destructive' });
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.full_name}?`)) return;
    try {
      const result = await apiClient.users.delete(user.id);
      if (result && result.softDeleted) {
        setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, status: 'inactive' } : item)));
        toast({ title: 'User deactivated', description: `${user.full_name} has related records and was marked inactive.` });
      } else {
        setUsers((prev) => prev.filter((item) => item.id !== user.id));
        toast({ title: 'User deleted', description: `${user.full_name} was removed.` });
      }
    } catch (error) {
      toast({ title: 'Delete failed', description: error.message || 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Create, edit, and manage team access for the inventory system.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit user' : 'Create user'}</CardTitle>
            <CardDescription>Only administrators can manage access roles and account status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" value={form.full_name} onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder={editingId ? 'Leave blank to keep current password' : 'Set a temporary password'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select id="role" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingId ? 'Save changes' : 'Create user'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing users</CardTitle>
            <CardDescription>Manage account access and permission levels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full bg-muted px-2.5 py-1 capitalize">{user.role}</span>
                  <span className="text-muted-foreground">Created {new Date(user.created_date).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleToggleStatus(user)}>{user.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(user)}>Delete</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
